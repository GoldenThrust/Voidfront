import numpy as np
import gymnasium as gym
from gymnasium import spaces
import pygame

from game.core.player.ships.enemies.manager import EnemyManager
from game.core.weapons.manager import WeaponManager
from game.core.world.canvas import draw_text
from utils import toroidalDelta, wrap

from game.core.player.ships import player
from game.core.world.world import world as game_world


class VoidFrontEnv(gym.Env):
    """
    Void Front navigation environment.

    The agent controls one ship inside a toroidal world.

    Action:
        thrust
        turn

    Observation:
        self
        enemies
    """

    metadata = {
        "render_modes": ["human"],
        "render_fps": 60,
    }

    def __init__(
        self,
        world_width=1_00_000,
        world_height=1_00_000,
        dt=1 / 60,
        max_speed=50000.0,
        speed_damping=0.999,
        max_enemies=100,
        max_episode_steps=10000,
        render_mode=None,
    ):
        super().__init__()

        self.world_width = float(getattr(game_world, "width", world_width))
        self.world_height = float(getattr(game_world, "height", world_height))

        # =========================================================
        # ENVIRONMENT
        # =========================================================

        self.dt = float(dt)

        self.speed_damping = float(speed_damping)

        self.max_speed = float(max_speed)

        self.K_enemies = int(max_enemies)
        # self.K_friends = int(max_friends)

        self.max_episode_steps = int(max_episode_steps)

        self.render_mode = render_mode

        # =========================================================
        # RANDOMIZED PHYSICS
        # =========================================================

        self.acceleration = 0.0
        self.turn_rate = 0.0

        # =========================================================
        # ENTITIES
        # =========================================================
        self.game_player = None
        self.game_friends = []
        self.weapon_names = [
            "pulse",
            "gatling",
            "rail",
            "plasma",
            "missile",
            "mine",
        ]
        self.ship_names = {
            "Bomber Drone": 0,
            "Fleet Drone": 1,
            "Miner Drone": 2,
            "Missile Launcher": 3,
            "Sniper": 4,
            "Tormenter Drone": 5,
        }
        self.weapon_index = 0

        # =========================================================
        # EPISODE
        # =========================================================

        self.current_step = 0
        self.last_health = 1000.0
        self.last_fire = False
        self.last_distance = 0.0
        self.last_kill_score = 0
        self.last_damage_score = 0

        # =========================================================
        # ACTION SPACE
        # =========================================================

        self.action_space = spaces.Box(
            low=-1,
            high=1,
            shape=(4,),
            dtype=np.float32,
        )

        # =========================================================
        # OBSERVATION SPACE
        # =========================================================
        #
        # SELF:
        #
        # [vx, vy, heading, acceleration, turn rate]
        #
        #
        # ENEMY:
        #
        # [relative_x, relative_y,  relative_enemy_vx, relative_enemy_vy, relative_distance, relative_angle, type]
        # =========================================================

        self.observation_space = spaces.Dict(
            {
                "self": spaces.Box(
                    low=np.array(
                        [
                            -1.0,  # vx_norm
                            -1.0,  # vy_norm
                            -1.0,  # heading_x
                            -1.0,  # heading_y
                            0.0,  # speed_norm
                            0.0,  # health_norm
                            0.0,  # heat_norm
                            0.0,  # weapon_idx_norm
                        ],
                        dtype=np.float32,
                    ),
                    high=np.array(
                        [
                            1.0,
                            1.0,
                            1.0,
                            1.0,
                            1.0,
                            1.0,
                            1.0,
                            1.0,
                        ],
                        dtype=np.float32,
                    ),
                    dtype=np.float32,
                ),
                # "friends": spaces.Box(
                #     low=np.array(
                #         [
                #             [
                #                 -1.0,  # dx
                #                 -1.0,  # dy
                #                 -1.0,  # d_vx
                #                 -1.0,  # d_vy
                #                 0.0,  # distance
                #                 -1.0,  # alignment
                #                 0.0,  # type
                #             ]
                #         ]
                #         * self.K_friends,
                #         dtype=np.float32,
                #     ),
                #     high=np.array(
                #         [[1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0]] * self.K_friends,
                #         dtype=np.float32,
                #     ),
                #     shape=(
                #         self.K_friends,
                #         8,
                #     ),
                #     dtype=np.float32,
                # ),
                "enemies": spaces.Box(
                    low=np.array(
                        [[-1.0, -1.0, -1.0, -1.0, 0.0, -1.0, 0.0]] * self.K_enemies,
                        dtype=np.float32,
                    ),
                    high=np.array(
                        [[1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0]] * self.K_enemies,
                        dtype=np.float32,
                    ),
                    shape=(
                        self.K_enemies,
                        7,
                    ),
                    dtype=np.float32,
                ),
            }
        )

        self.window = None
        self.clock = None
        self.render_mode = render_mode
        self.window_size = (1920, 1080)

    def _longest_distance(self):
        dwx = toroidalDelta(self.world_width / 2, 0, self.world_width)

        dwy = toroidalDelta(self.world_height / 2, 0, self.world_height)

        return np.linalg.norm(
            np.array(
                [dwx, dwy],
                dtype=np.float32,
            )
        )

    # =============================================================
    # TOROIDAL RELATIVE POSITION
    # =============================================================

    def _wrap_relative_vector(
        self,
        dx: float,
        dy: float,
    ):
        """
        Find the shortest displacement between two points
        in a toroidal world.
        """

        dx = wrap(dx, self.world_width)

        dy = wrap(dy, self.world_height)

        return dx, dy

    # =============================================================
    # NORMALIZE WORLD POSITION
    # =============================================================

    def _normalize_position(
        self,
        x: float,
        y: float,
    ):
        """
        Convert world coordinates to [-1, 1].

        0 world position -> -1
        center           -> 0
        maximum          -> +1
        """

        nx = (x / self.world_width) * 2.0 - 1.0

        ny = (y / self.world_height) * 2.0 - 1.0

        return nx, ny

    # =============================================================
    # NORMALIZE RELATIVE POSITION
    # =============================================================

    def _normalize_relative_position(
        self,
        dx: float,
        dy: float,
    ):
        """
        Normalize a relative toroidal displacement.

        -world_width / 2 -> -1
        0                 -> 0
        +world_width / 2 -> +1
        """

        nx = dx / (self.world_width / 2)

        ny = dy / (self.world_height / 2)

        return nx, ny

    # =============================================================
    # NORMALIZE ANGLE
    # =============================================================

    @staticmethod
    def _normalize_angle(angle: float):
        """
        Convert [0, 2π) to [-1, 1].

        0       -> -1
        π       ->  0
        2π      -> +1
        """

        return angle / np.pi - 1.0

    def angleAndDistance(self, enemy):
        dx = toroidalDelta(self.ship.x, enemy.x, self.world_width)

        dy = toroidalDelta(self.ship.y, enemy.y, self.world_height)

        relative = np.array(
            [dx, dy],
            dtype=np.float32,
        )

        target_direction = 0
        distance = np.linalg.norm(relative)
        if np.linalg.norm(distance) > 1e-6:
            target_direction = relative / distance

        heading = np.array(
            [
                -np.sin(self.ship.angle),
                -np.cos(self.ship.angle),
            ],
            dtype=np.float32,
        )

        return (
            np.dot(
                heading,
                target_direction,
            ),
            distance,
        )

    # =============================================================
    # COMBAT ACTIONS
    # =============================================================

    def _coerce_action(self, action):
        arr = np.asarray(action, dtype=np.float32).reshape(-1)
        if arr.size < 2:
            arr = np.pad(arr, (0, 2 - arr.size), constant_values=0.0)
        if arr.size < 4:
            arr = np.pad(arr, (0, 4 - arr.size), constant_values=0.0)
        return arr[:4]

    def _get_obs(self):
        ship = self.game_player

        ship_speed = float(getattr(ship, "speed", 0.0))
        ship_angle = float(getattr(ship, "angle", 0.0))
        ship_vx = -np.sin(ship_angle) * ship_speed
        ship_vy = -np.cos(ship_angle) * ship_speed
        heading_x = -np.sin(ship_angle)
        heading_y = -np.cos(ship_angle)
        health = float(getattr(ship, "life", 1000.0))
        health_norm = np.clip(health / 1000.0, 0.0, 1.0)
        heat = float(getattr(ship, "heat", 0.0))
        heat_norm = np.clip(heat / max(getattr(ship, "maxHeat", 1000.0), 1.0), 0.0, 1.0)
        weapon_norm = self.weapon_index / (len(self.weapon_names) - 1)

        self_vec = np.array(
            [
                np.clip(ship_vx / self.max_speed, -1.0, 1.0),
                np.clip(ship_vy / self.max_speed, -1.0, 1.0),
                heading_x,
                heading_y,
                np.clip(ship_speed / self.max_speed, 0.0, 1.0),
                health_norm,
                heat_norm,
                weapon_norm,
            ],
            dtype=np.float32,
        )

        enemies = EnemyManager.ships[: self.K_enemies]
        enemies_mat = np.zeros((self.K_enemies, 7), dtype=np.float32)
        for i, enemy in enumerate(enemies):
            dx = toroidalDelta(enemy.x, ship.x, self.world_width)
            dy = toroidalDelta(enemy.y, ship.y, self.world_height)
            enemy_angle = float(getattr(enemy, "angle", 0.0))
            enemy_speed = float(getattr(enemy, "speed", 0.0))
            enemy_vx = -np.sin(enemy_angle) * enemy_speed
            enemy_vy = -np.cos(enemy_angle) * enemy_speed
            relative_vx = (enemy_vx - ship_vx) / max(self.max_speed * 2.0, 1.0)
            relative_vy = (enemy_vy - ship_vy) / max(self.max_speed * 2.0, 1.0)
            dist = np.linalg.norm(np.array([dx, dy], dtype=np.float32))
            target_dir = np.array([dx, dy], dtype=np.float32)
            if np.linalg.norm(target_dir) > 1e-6:
                target_dir = target_dir / np.linalg.norm(target_dir)
            heading_vec = np.array(
                [-np.sin(ship_angle), -np.cos(ship_angle)], dtype=np.float32
            )
            alignment = float(np.clip(np.dot(heading_vec, target_dir), -1.0, 1.0))

            enemy_norm = self.ship_names.get(enemy.name, 0) / max(
                len(self.ship_names) - 1, 1
            )
            enemies_mat[i] = np.array(
                [
                    np.clip(dx / (self.world_width / 2.0), -1.0, 1.0),
                    np.clip(dy / (self.world_height / 2.0), -1.0, 1.0),
                    np.clip(relative_vx, -1.0, 1.0),
                    np.clip(relative_vy, -1.0, 1.0),
                    np.clip(dist / max(self._longest_distance(), 1.0), 0.0, 1.0),
                    alignment,
                    enemy_norm,
                ],
                dtype=np.float32,
            )

        # friends = self.game_friends[: self.K_friends]
        # friend_mat = np.zeros((self.K_friends, 8), dtype=np.float32)
        # for i, friend in enumerate(friends):
        #     dx = toroidalDelta(friend.x, ship.x, self.world_width)
        #     dy = toroidalDelta(friend.y, ship.y, self.world_height)
        #     friend_angle = float(getattr(friend, "angle", 0.0))
        #     friend_speed = float(getattr(friend, "speed", 0.0))
        #     friend_vx = -np.sin(friend_angle) * friend_speed
        #     friend_vy = -np.cos(friend_angle) * friend_speed
        #     relative_vx = (friend_vx - ship_vx) / max(self.max_speed * 2.0, 1.0)
        #     relative_vy = (friend_vy - ship_vy) / max(self.max_speed * 2.0, 1.0)
        #     dist = np.linalg.norm(np.array([dx, dy], dtype=np.float32))
        #     target_dir = np.array([dx, dy], dtype=np.float32)
        #     if np.linalg.norm(target_dir) > 1e-6:
        #         target_dir = target_dir / np.linalg.norm(target_dir)
        #     heading_vec = np.array(
        #         [-np.sin(ship_angle), -np.cos(ship_angle)], dtype=np.float32
        #     )
        #     alignment = float(np.clip(np.dot(heading_vec, target_dir), -1.0, 1.0))
        #     friend_norm = self.ship_names.get(friend.name, 0) / max(
        #         len(self.ship_names) - 1, 1
        #     )

        #     friend_mat[i] = np.array(
        #         [
        #             np.clip(dx / (self.world_width / 2.0), -1.0, 1.0),
        #             np.clip(dy / (self.world_height / 2.0), -1.0, 1.0),
        #             np.clip(relative_vx, -1.0, 1.0),
        #             np.clip(relative_vy, -1.0, 1.0),
        #             np.clip(dist / max(self._longest_distance(), 1.0), 0.0, 1.0),
        #             alignment,
        #             friend_norm,
        #         ],
        #         dtype=np.float32,
        #     )

        return {
            "self": self_vec,
            "enemies": enemies_mat,
            # "friends": friend_mat
        }

    # =============================================================
    # RESET
    # =============================================================

    def reset(
        self,
        seed=None,
        options=None,
    ):
        super().reset(seed=seed)
        self.game_player = player.PlayerShip.spawn(
            self.world_width / 2, self.world_height / 2
        )
        EnemyManager.init(self.K_enemies)

        # self.game_friends = []
        # for _ in range(self.K_friends):
        #     friend = GameShip(
        #         x=self.np_random.uniform(0.0, self.world_width),
        #         y=self.np_random.uniform(0.0, self.world_height),
        #         width=20.0,
        #         height=20.0,
        #         angle=self.np_random.uniform(0.0, 2.0 * np.pi),
        #         acceleration=float(self.np_random.uniform(100.0, 1000.0)),
        #         turnRate=float(self.np_random.uniform(0.1, 1.0)),
        #         color="red",
        #         name=f"Friend-{len(self.game_friends)}",
        #         controllable=False,
        #         life=1000.0,
        #         maxWeaponHeat=10000,
        #     )
        #     friend.dampSpeed = self.speed_damping
        #     self.game_friends.append(friend)

        self.acceleration = float(getattr(self.game_player, "acceleration", 3500.0))
        self.turn_rate = float(getattr(self.game_player, "turnRate", 2.0))
        self.max_speed = float(getattr(self.game_player, "maxSpeed", 5000.0))
        self.current_step = 0
        self.last_health = float(getattr(self.game_player, "life", 1000.0))
        observation = self._get_obs()
        return observation, {
            "acceleration": self.acceleration,
            "turn_rate": self.turn_rate,
        }

    # =============================================================
    # STEP
    # =============================================================

    def step(self, action):
        self.current_step += 1
        action = self._coerce_action(action)
        thrust = float(np.clip(action[0], -1.0, 1.0))
        turn = float(np.clip(action[1], -1.0, 1.0))
        fire_signal = float(action[2] > 0.5)
        weapon_signal = float(action[3])

        ship = self.game_player

        self.last_health = float(getattr(ship, "life", 1000.0))
        self.last_fire = False

        self.game_player.update(self.current_step, self.dt, thrust=thrust, turn=turn)
        if fire_signal > 0.5 and hasattr(self.game_player, "fire"):
            self.game_player.fire()
            self.last_fire = True
        self.game_player.set_weapon(weapon_signal)

        for enemy in EnemyManager.ships:
            enemy_turn = self.np_random.uniform(-1.0, 1.0)
            enemy_thrust = self.np_random.uniform(-0.5, 1.0)
            enemy.update(
                self.current_step, self.dt, thrust=enemy_thrust, turn=enemy_turn
            )

        reward, distance, alignment = self._calculate_reward()

        self.last_distance = distance
        terminated = self.game_player.life <= 0 or (len(EnemyManager.ships) < 1)
        truncated = self.current_step >= self.max_episode_steps
        observation = self._get_obs()
        info = {
            "step": self.current_step,
            "speed": getattr(self.game_player, "speed", 0.0),
            "angle": getattr(self.game_player, "angle", 0.0),
            "acceleration": self.acceleration,
            "turn_rate": self.turn_rate,
            "distance": distance,
            "alignment": alignment,
            "weapon": self.weapon_index,
        }
        return observation, reward, terminated, truncated, info

    def _calculate_reward(self):
        ship = self.game_player
        enemies = EnemyManager.ships

        if ship is None or not enemies:
            return 0.0, 0.0, 0.0

        # ==========================================================
        # Nearest enemy
        # ==========================================================

        target = min(
            enemies,
            key=lambda enemy: np.linalg.norm(
                np.array(
                    [
                        toroidalDelta(enemy.x, ship.x, self.world_width),
                        toroidalDelta(enemy.y, ship.y, self.world_height),
                    ],
                    dtype=np.float32,
                )
            ),
        )

        dx = toroidalDelta(target.x, ship.x, self.world_width)
        dy = toroidalDelta(target.y, ship.y, self.world_height)

        relative = np.array([dx, dy], dtype=np.float32)

        distance = float(np.linalg.norm(relative))

        target_dir = (
            relative / distance
            if distance > 1e-6
            else np.array([1.0, 0.0], dtype=np.float32)
        )

        heading = np.array(
            [
                -np.sin(ship.angle),
                -np.cos(ship.angle),
            ],
            dtype=np.float32,
        )

        heading /= max(np.linalg.norm(heading), 1e-6)

        alignment = float(np.clip(np.dot(heading, target_dir), -1.0, 1.0))

        longest = max(self._longest_distance(), 1.0)

        # ==========================================================
        # Progress
        # ==========================================================

        progress = (self.last_distance - distance) / longest

        # ==========================================================
        # Damage
        # ==========================================================

        current_health = float(ship.life)

        damage_taken = max(0.0, self.last_health - current_health)

        damage_penalty = -damage_taken / 1000.0

        # ==========================================================
        # Kill reward
        # ==========================================================

        damage = getattr(ship, "damage_score", 0.0) - self.last_damage_score

        damage_reward = damage / 100.0

        self.last_damage_score = getattr(ship, "damage_score", 0.0)

        kill_reward = 0.0

        kills = getattr(ship, "killScore", 0) - self.last_kill_score

        if kills > 0:
            kill_reward = 10.0 * kills

        self.last_kill_score = getattr(ship, "killScore", 0)

        # ==========================================================
        # Target reached
        # ==========================================================

        target_reward = 0.0

        if distance < 250:
            target_reward += 2.0

        if distance < 100:
            target_reward += 5.0

        # ==========================================================
        # Time penalty
        # ==========================================================

        living_reward = 0.01

        time_penalty = -0.002

        timeout_penalty = (
            -5.0
            if self.current_step >= self.max_episode_steps
            else 0.0
        )

        death_penalty = -10.0 if current_health <= 0 else 0.0

        # ==========================================================
        # Final reward
        # ==========================================================

        reward = (
            4.0 * progress
            + 1.5 * alignment
            + damage_reward
            + kill_reward
            + target_reward
            + damage_penalty
            + living_reward
            + time_penalty
            + timeout_penalty
            + death_penalty
        )

        self.last_distance = distance
        self.last_health = current_health

        return reward, distance, alignment
    # =============================================================
    # RENDER
    # =============================================================
    def render(self):
        if self.render_mode == "human":
            WeaponManager.render()
            self.game_player.render()
            EnemyManager.render()

            draw_text(
                (
                    f"Ships Alive: {len(EnemyManager.ships)} - Destroyed: 0 - "
                    f"Kill: {getattr(player.ship, 'killScore', 0)} Weapon name: "
                    f"{getattr(getattr(player.ship, 'weapon', None), 'name', '')} heat: "
                    f"{int((getattr(player.ship, 'heat', 0) / max(getattr(player.ship, 'maxHeat', 1), 1)) * 100)}"
                ),
                (10, 20),
                color="white",
                size=20,
            )
            for event in pygame.event.get():
                if event.type == pygame.QUIT:
                    pygame.quit()
                    self.window = None
                    return None

            pygame.display.flip()
            if self.clock is not None:
                self.clock.tick(self.metadata["render_fps"])
            return None

        if self.render_mode == "rgb_array":
            return np.transpose(pygame.surfarray.array3d(self.window), (1, 0, 2))

        return None

    # =============================================================
    # CLOSE
    # =============================================================

    def close(self):
        if self.window is not None:
            pygame.quit()
            self.window = None

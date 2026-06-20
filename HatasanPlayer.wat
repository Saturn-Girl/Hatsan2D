(module
  ;; 1. Memory Allocation
  ;; Allocate 1 page of linear memory (64KB), which is plenty for player data.
  (memory (export "memory") 1)

  ;; Define Memory Offset Constants for the Player Structural Fields:
  ;; Offset 0  : Player X (f32 - 4 bytes)
  ;; Offset 4  : Player Y (f32 - 4 bytes)
  ;; Offset 8  : Health   (i32 - 4 bytes)
  ;; Offset 12 : Score    (i32 - 4 bytes)

  ;; 2. Initialization Function
  ;; Sets up the starting parameters for the HP dx2300 desktop player
  (func (export "initPlayer") (param $x f32) (param $y f32) (param $hp i32)
    ;; Store initial X
    (f32.store (i32.const 0) (local.get $x))
    ;; Store initial Y
    (f32.store (i32.const 4) (local.get $y))
    ;; Store initial Health
    (i32.store (i32.const 8) (local.get $hp))
    ;; Store initial Score (Starts at 0)
    (i32.store (i32.const 12) (i32.const 0))
  )

  ;; 3. Movement Logic
  ;; Adjusts the player's position parameters directly in memory
  (func (export "movePlayer") (param $dx f32) (param $dy f32)
    ;; Load X, add $dx, and store it back
    (f32.store (i32.const 0)
      (f32.add (f32.load (i32.const 0)) (local.get $dx))
    )
    ;; Load Y, add $dy, and store it back
    (f32.store (i32.const 4)
      (f32.add (f32.load (i32.const 4)) (local.get $dy))
    )
  )

  ;; 4. Getters (To pull data back into JavaScript / TurboWarp)
  (func (export "getX") (result f32)
    (f32.load (i32.const 0))
  )

  (func (export "getY") (result f32)
    (f32.load (i32.const 4))
  )

  (func (export "getHealth") (result i32)
    (i32.load (i32.const 8))
  )

  ;; 5. Damage System
  ;; Subtracts health when hit by bullet hell patterns from Hanako or the HP d220 MT
  (func (export "takeDamage") (param $amount i32) (result i32)
    ;; FIXED: Declared local variables use '(local $name type)' syntax
    (local $current_hp i32)
    
    (local.set $current_hp (i32.load (i32.const 8)))

    ;; Subtract damage
    (local.set $current_hp (i32.sub (local.get $current_hp) (local.get $amount)))

    ;; Store updated health status
    (i32.store (i32.const 8) (local.get $current_hp))

    ;; Return remaining health status
    (local.get $current_hp)
  )
)
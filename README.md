# arduino_mouse
Humanized Mouse Control with Arduino and Python
This project enables realistic, human-like mouse movements using an Arduino (e.g., Leonardo or Pro Micro) controlled by Python via serial communication.

Instead of robotic straight-line motion, the cursor moves with natural imperfections:

Smooth Bezier curves
Subtle hand tremor
Non-linear speed (ease-in and ease-out)
Adjustable duration and precision
Python calculates the trajectory and sends relative movement commands (x=...,y=...) to the Arduino, which acts as a USB HID mouse. The system includes tolerance-based correction to ensure accuracy without overshooting.

Ideal for automation, UI testing, or any application where human-like input is required to avoid bot detection.

How It Works
Python script computes a humanized path from current to target position.
Sends incremental delta movements to Arduino.
Arduino translates commands into actual mouse movements.
Final position is fine-tuned if needed.
Calibration
Adjust SCALE_FACTOR in the Arduino code to match your system's DPI and sensitivity. Small test movements help fine-tune precision.

Usage
Run the Python script and call human_move(x, y) to move the cursor naturally to any screen coordinate.

Compatible with any setup where Arduino can act as a USB mouse. Can be extended for ESP32 + Bluetooth HID.

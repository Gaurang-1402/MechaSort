import xarm

arm = xarm.Controller('USB')

servo1 = xarm.Servo(1)
servo2 = xarm.Servo(2)


# Dancing Logic
arm.setPosition(2, 0, 2000, wait=False)
arm.setPosition(1, 500, 2000, wait=True)
arm.setPosition(2, 1000, 4000, wait=False)

arm.setPosition(1, 0, 1000, wait=True)
arm.setPosition(1, 500, 1000, wait=True)
arm.setPosition(1, 0, 1000, wait=True)
arm.setPosition(1, 500, 1000, wait=True)


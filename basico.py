import pyautogui as ps
ps.useImageNotFoundException = False
import serial
import json
import time
import random

MAP = {4781,65,228,228}
BATTLE = {4418,71,352,376}
count = 0

RED_RGB = (255,0,0)
PNK_RGB = (255,128,128)
colors = [RED_RGB, PNK_RGB]

monster_x = 4445
monster_y = 94

TOLERANCIA = 20
attack_delay = random.uniform(0.15, 0.25)

# Conecta ao Arduino (ajuste a porta para seu Windows, ex: COM3, COM8)
arduino = serial.Serial('COM3', 9600, timeout=5)
time.sleep(2)  # aguarda inicialização

def get_attack_delay():
    return random.uniform(0.15, 0.25)

def wait_arduino_done():
    while True:
        resposta = arduino.readline().decode(errors='ignore').strip()
        if resposta == "DONE":
            return

def arduino_type(key):
    command = f"KEY:{key}\n"
    arduino.write(command.encode())

    resposta = arduino.readline().decode().strip()
    while resposta != "DONE":
        resposta = arduino.readline().decode().strip()

def arduino_click():
    arduino.write(b"CLICK\n")

    resposta = arduino.readline().decode().strip()
    while resposta != "DONE":
        resposta = arduino.readline().decode().strip()

def move_to_position(target_x, target_y):
    """Move o mouse até a posição exata especificada"""
    tolerance = 3  # Tolerância de 3 pixels para considerar "chegou"
    max_attempts = 20
    attempts = 0

    while attempts < max_attempts:
        # Verifica posição atual
        current_x, current_y = ps.position()

        # Calcula diferença necessária
        diff_x = target_x - current_x
        diff_y = target_y - current_y

        # Verifica se já chegou no destino
        if abs(diff_x) <= tolerance and abs(diff_y) <= tolerance:
            print(f"Chegou na posição ({current_x}, {current_y})")
            return True

        # Envia comando ao Arduino
        command = f"x={diff_x},y={diff_y}\n"
        arduino.write(command.encode())
        print(f"Posição atual: ({current_x}, {current_y}) -> Movendo ({diff_x}, {diff_y})")

        # Aguarda Arduino processar
        wait_arduino_done()

        attempts += 1

    print(f"move_to_position falhou após {max_attempts} tentativas")
    return False


def check_battle():
    return ps.locateOnScreen('./imgs/battle.png', confidence=0.8, region=BATTLE)


def pixel_target():
    start_time = time.time()

    while True:
        color_found = False

        for color in colors:
            if ps.pixelMatchesColor(monster_x, monster_y, color, tolerance=TOLERANCIA):
                color_found = True
                messages = ["Cor correta", "Ainda em combate", "Atacando o monstro"]
                print(random.choice(messages))
                print(monster_x, monster_y)
                print(ps.pixel(monster_x, monster_y))
                break

        if not color_found:
            print("Monstro morreu")
            return False
        
        if time.time() - start_time > 10:
            print("Tempo esgotado no pixel_target()")
            return True

    time.sleep(0.5)


def kill_monster():
    while check_battle() is None:

        # PEGA LOOT
        arduino_type('f')
        get_attack_delay()

        # ATACAR
        arduino_type('t')
        time.sleep(0.5)

        if pixel_target():
            print("tempo esgotando, saindo da função")
            break


def go_flag(path, wait):
    flag = ps.locateOnScreen(path, confidence=0.8, region=MAP)

    if flag:
        x, y = ps.center(flag)
        move_to_position(x, y)
        arduino_click()
        time.sleep(wait)
    else:
        print(f"Flag não encontrada {path}")


def check_player_pos(path):
    pass

with open('mapa.json', 'r') as f:
    mapa = json.load(f)

time.sleep(3)

while count < 40:
    count += 1
    for item in dados:
        kill_monster()
        time.sleep(attack_delay)

        print(item['file'])

        arduino_type('f')

        go_flag(item['image'], item['wait'])

print("DONE")
        
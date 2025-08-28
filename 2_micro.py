import serial
import pyautogui as pg
import time
import random
import math

# ===================================
# 🔧 CONFIGURAÇÕES
# ===================================
PORTA = 'COM8'                  # Ajuste para sua porta
TOLERANCE = 2                   # Tolerância máxima em pixels
pg.FAILSAFE = False             # Desativa proteção de cantos

# Conecta ao Arduino
try:
    arduino = serial.Serial(PORTA, 9600, timeout=1)
    print(f"✅ Conectado ao Arduino em {PORTA}")
    time.sleep(2)
except Exception as e:
    print(f"❌ Erro ao conectar: {e}")
    exit()

# ===================================
# Função: Aguarda confirmação DONE
# ===================================
def wait_for_done(timeout=1.5):
    start = time.time()
    while (time.time() - start) < timeout:
        if arduino.in_waiting > 0:
            try:
                line = arduino.readline().decode().strip()
                if line == "DONE":
                    return True
                elif line.startswith("CMD:"):
                    pass  # Opcional: descomente para debug: print(f"📩 {line}")
            except Exception as e:
                print(f"❌ Erro ao ler resposta: {e}")
        time.sleep(0.005)
    return False

# ===================================
# Função: Movimento Direto (para ajustes finos)
# ===================================
def quick_move(dx, dy):
    """Envia um único comando direto para pequenos ajustes"""
    if abs(dx) < 1 and abs(dy) < 1:
        return True
    cmd = f"x={int(dx)},y={int(dy)}\n"
    try:
        arduino.write(cmd.encode())
        arduino.flush()
        return wait_for_done()
    except Exception as e:
        print(f"❌ Erro em quick_move: {e}")
        return False

# ===================================
# Função: Movimento Humanizado (só para distâncias maiores)
# ===================================
def human_move_arduino(target_x, target_y, duration=None):
    """
    Movimento natural com curva, aceleração e tremor que desaparece no final.
    Não usado se a distância for < 20px.
    """
    start_x, start_y = pg.position()
    distance = math.hypot(target_x - start_x, target_y - start_y)

    # Se muito perto, usa ajuste direto
    if distance < 20:
        return quick_move(target_x - start_x, target_y - start_y)

    if duration is None:
        duration = random.uniform(0.5, 0.9)

    steps = max(6, int(distance / 25))

    # Ponto de controle da curva: proporcional à distância
    mid_x = (start_x + target_x) / 2
    mid_y = (start_y + target_y) / 2
    control_x = mid_x + random.uniform(-0.15 * distance, 0.15 * distance)
    control_y = mid_y + random.uniform(-0.15 * distance, 0.15 * distance)

    start_time = time.time()

    for i in range(steps + 1):
        t = i / steps
        time_factor = 3 * t**2 - 2 * t**3  # Ease-in-out

        # Bezier quadrática
        curr_x = (1 - t)**2 * start_x + 2 * (1 - t) * t * control_x + t**2 * target_x
        curr_y = (1 - t)**2 * start_y + 2 * (1 - t) * t * control_y + t**2 * target_y

        # Tremor que desaparece no final
        jitter_strength = 3.0 * (1 - t**2)  # Diminui com o tempo
        if i != steps and jitter_strength > 0.5:
            curr_x += random.uniform(-jitter_strength, jitter_strength)
            curr_y += random.uniform(-jitter_strength, jitter_strength)

        curr_x = int(round(curr_x))
        curr_y = int(round(curr_y))

        dx = curr_x - pg.position()[0]
        dy = curr_y - pg.position()[1]

        if abs(dx) < 1 and abs(dy) < 1:
            continue

        cmd = f"x={int(dx)},y={int(dy)}\n"
        try:
            arduino.write(cmd.encode())
            arduino.flush()
            if not wait_for_done():
                return False
        except Exception as e:
            print(f"❌ Erro ao enviar movimento: {e}")
            return False

        # Controla tempo
        expected_time = start_time + time_factor * duration
        sleep_time = expected_time - time.time()
        if sleep_time > 0:
            time.sleep(sleep_time)

    # Ajuste final só se necessário
    final_x, final_y = pg.position()
    err_x = target_x - final_x
    err_y = target_y - final_y

    if abs(err_x) <= TOLERANCE and abs(err_y) <= TOLERANCE:
        return True

    return quick_move(err_x, err_y)

# ===================================
# Função: Mover com correção inteligente
# ===================================
def move_to_position(target_x, target_y, tolerance=TOLERANCE, max_attempts=6):
    print(f"\n🎯 Movendo para ({target_x}, {target_y}) | Tolerância: ±{tolerance}px")

    for tentativa in range(1, max_attempts + 1):
        curr_x, curr_y = pg.position()
        diff_x = target_x - curr_x
        diff_y = target_y - curr_y

        # Verifica se já está no alvo
        if abs(diff_x) <= tolerance and abs(diff_y) <= tolerance:
            print(f"✅ Alvo alcançado: ({curr_x}, {curr_y})")
            return True

        print(f"🚶 Tentativa {tentativa}: ({curr_x}, {curr_y}) → Movendo ({diff_x}, {diff_y})")

        # Primeira tentativa: movimento humanizado (se dist > 20px)
        if tentativa == 1:
            success = human_move_arduino(target_x, target_y)
        else:
            # Tentativas seguintes: ajuste direto
            success = quick_move(diff_x, diff_y)

        if not success:
            print("❌ Falha no movimento")
            return False

        time.sleep(0.05)  # Pequeno delay entre ajustes

    # Verificação final
    final_x, final_y = pg.position()
    err_x = abs(final_x - target_x)
    err_y = abs(final_y - target_y)

    if err_x <= tolerance and err_y <= tolerance:
        print(f"✅ Precisão alcançada: ({final_x}, {final_y})")
        return True
    else:
        print(f"❌ Falha: erro final ({err_x}, {err_y})px > {tolerance}px")
        return False

# ===================================
# Interface do usuário
# ===================================
if __name__ == "__main__":
    print("=== 🖱️  Movimento Humanizado com Arduino (Versão Otimizada) ===")
    print(f"🔧 Tolerância: ±{TOLERANCE}px | Porta: {PORTA}")
    print("Digite: x,y (ex: 1000,600)")
    print("Digite 'sair' para encerrar\n")

    try:
        while True:
            cmd = input("Ir para (x,y): ").strip()
            if cmd.lower() in ['sair', 'exit', 'quit']:
                break
            if not cmd:
                continue

            try:
                x_str, y_str = cmd.split(',')
                target_x = int(x_str.strip())
                target_y = int(y_str.strip())

                move_to_position(target_x, target_y)

            except ValueError:
                print("❌ Formato inválido! Use: x,y")
            except Exception as e:
                print(f"❌ Erro: {e}")

    except KeyboardInterrupt:
        print("\n\n👋 Encerrando...")
    finally:
        arduino.close()
        print("🔌 Conexão encerrada.")
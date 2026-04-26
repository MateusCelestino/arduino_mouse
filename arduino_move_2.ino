#include <Mouse.h>
#include <Keyboard.h>

const int MAX_MOVE = 80;
const float SCALE_FACTOR = 0.32; // 🔧 AJUSTE ESTE VALOR! (teste: 0.30, 0.31, 0.32, 0.33...)

void setup()
{
  Serial.begin(9600);
  Mouse.begin();
  Keyboard.begin();
  while (!Serial)
  {
    delay(10);
  }
}

void moveMousePrecise(int targetX, int targetY)
{
  int scaledX = (int)(targetX * SCALE_FACTOR);
  int scaledY = (int)(targetY * SCALE_FACTOR);

  int remainingX = scaledX;
  int remainingY = scaledY;

  while (remainingX != 0 || remainingY != 0)
  {
    int moveX = constrain(remainingX, -MAX_MOVE, MAX_MOVE);
    int moveY = constrain(remainingY, -MAX_MOVE, MAX_MOVE);

    Mouse.move(moveX, moveY);
    remainingX -= moveX;
    remainingY -= moveY;

    delay(2);
  }
}

void loop()
{
  if (Serial.available() > 0)
  {
    String receivedData = Serial.readStringUntil('\n');
    receivedData.trim();

    if (receivedData.length() == 0)
      return;

    // Click
    if (receivedData.equalsIgnoreCase("CLICK"))
    {
      Mouse.click();
      Serial.println("DONE");
      return;
    }

    // ==== novo: teclado =====
    if (receivedData.equalsIgnoreCase("KEY:"))
    {
      char key = receivedData.substring(4).charAt(0); // pega o primeiro caractere após "KEY:"
      Keyboard.press(key);
      delay(5); // pequeno atraso para garantir que a tecla seja registrada
      Keyboard.release(key);
      Serial.println("DONE");
      return;
    }

    int xIndex = receivedData.indexOf("x=");
    int yIndex = receivedData.indexOf("y=");
    int commaIndex = receivedData.indexOf(",");

    if (xIndex != -1 && yIndex != -1 && commaIndex != -1)
    {
      int x = receivedData.substring(xIndex + 2, commaIndex).toInt();
      int y = receivedData.substring(yIndex + 2).toInt();

      Serial.print("CMD: ");
      Serial.print(x);
      Serial.print(",");
      Serial.println(y);

      moveMousePrecise(x, y);

      Serial.println("DONE");
    }
  }
}
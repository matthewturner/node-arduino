#include "main.h"

void setup()
{
    Serial.begin(115200);

    DEBUG_PLN(F("Setup complete, continuing..."));
}

void loop()
{
    static char buffer[10];
    static byte index = 0;
    while (Serial.available())
    {
        buffer[index] = Serial.read();
        index++;
    }

    if (index > 0)
    {
        if (buffer[index - 1] == '!')
        {
            DEBUG_PLN(F("Received message:"));
            DEBUG_PLN(buffer);

            buffer[index] = '\0';
            index = 0;
        }
    }

    if (strcmp(">ping!", buffer) == 0)
    {
        DEBUG_PLN(F("pong!"));
        for (byte i = 0; i < 10; i++)
        {
            buffer[i] = '\0';
        }
    }
}
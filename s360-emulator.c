#include <stdio.h>
#include <stdlib.h>

typedef struct {
    int length;
    unsigned char* data;
} Program;

Program* load_program(FILE* inputFile) {
    fseek(inputFile, 0, SEEK_END);
    int length = ftell(inputFile);

    Program* program = (Program*)malloc(sizeof(Program));
    program->length = length;
    program->data = (unsigned char*)malloc(length);

    fseek(inputFile, 0, SEEK_SET);
    fread(program->data, 1, length, inputFile);
    return program;
}

void run(FILE* inputFile) {
    Program* program = load_program(inputFile);
    //TODO: Execute the program

    free(program);
}

int main(int argc, char** argv) {
    if (argc != 2) {
        printf("Usage: s360-emulator <input_file>\n");
        return 1;
    }

    FILE* inputFile = fopen(argv[1], "rb");
    if (inputFile == NULL) {
        printf("Cannot open input file\n");
        return 1;
    }

    run(inputFile);

    fclose(inputFile);
    return 0;
}
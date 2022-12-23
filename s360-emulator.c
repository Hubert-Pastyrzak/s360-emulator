#include <stdio.h>
#include <stdlib.h>

unsigned long long psw;

void write_ia(int value) {
    psw = (psw & 0x000000FFFFFFFFFFULL) | (((unsigned long long)(value & 0xFFFFFF)) << 40);
}

int read_ia() {
    return (psw & 0xFFFFFF0000000000ULL) >> 40;
}

typedef struct {
    int length;
    unsigned char* data;
} Program;

unsigned char fetch_byte(Program* program) {
    int ia = read_ia();
    unsigned char value = program->data[ia];
    write_ia(ia + 1);
    return value;
}

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

void report_invalid_opcode_error(unsigned char opcode) {
    printf("Error: Invalid opcode 0x%x\n", opcode);
}

int execute_opcode(unsigned char opcode) {
    switch (opcode) {
        default:
            report_invalid_opcode_error(opcode);
            return 0;
    }
}

void run(FILE* inputFile) {
    Program* program = load_program(inputFile);

    psw = 0x0000000000000000ULL;
    while (read_ia() < program->length) {
        unsigned char opcode = fetch_byte(program);
        if (!execute_opcode(opcode)) {
            free(program);
            printf("Program terminated\n");
            return;
        }
    }

    free(program);
    printf("Program finished\n");
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
// src/utils/textUtils.ts
export function splitLines(text: string, maxWidth: number = 100): string[] {
    const words = text.split(' ');
    const lines: string[] = [];
    let currentLine = '';

    words.forEach(word => {
        if ((currentLine + word).length <= maxWidth) {
            currentLine += (currentLine === '' ? '' : ' ') + word;
        } else {
            lines.push(currentLine);
            currentLine = word;
        }
    });
    if (currentLine !== '') {
        lines.push(currentLine);
    }
    return lines;
}
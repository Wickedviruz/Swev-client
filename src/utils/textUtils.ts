// Helper för radbrytning
export function splitLines(text: string, maxLen = 28): string[] {
    const words = text.split(" ");
    const lines: string[] = [];
    let line = "";
    for (const word of words) {
        if ((line + word).length > maxLen) {
            if (line.length) lines.push(line);
            line = word;
        } else {
            line = line.length ? `${line} ${word}` : word;
        }
    }
    if (line.length) lines.push(line);
    return lines;
}
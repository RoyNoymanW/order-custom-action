export class WindowOpener {
    private static instance: WindowOpener;

    private constructor() {}

    public static getInstance(): WindowOpener {
        if (!WindowOpener.instance) {
            WindowOpener.instance = new WindowOpener();
        }
        return WindowOpener.instance;
    }

    public openLink(url: string): void {
        try {
            window.open(url, '_blank');
            console.log("Link opened successfully:", url);
        } catch (error) {
            console.error("Error opening link:", error);
            throw new Error("Failed to open link");
        }
    }
}
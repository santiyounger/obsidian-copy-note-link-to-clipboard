import { Plugin } from 'obsidian';

export default class CopyFileNamePlugin extends Plugin {
	async onload() {
		// Add the command to the command palette
		this.addCommand({
			id: 'copy-file-name',
			name: 'Copy file name to clipboard',
			callback: () => {
				const activeFile = this.app.workspace.getActiveFile();
				if (activeFile) {
					const fileName = activeFile.basename;
					const wrappedFileName = `[[${fileName}]]`;
					
					// Copy the wrapped file name to the clipboard
					navigator.clipboard.writeText(wrappedFileName).then(() => {
						new Notice(`Copied: ${wrappedFileName}`);
					});
				} else {
					new Notice('No active file found.');
				}
			}
		});
	}

	onunload() {
		// Cleanup if necessary
	}
}

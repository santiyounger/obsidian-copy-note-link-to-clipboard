import { Plugin, Notice, TFile, SuggestModal } from 'obsidian';

export default class CopyFileNamePlugin extends Plugin {
	async onload() {
		// Command to copy the active file name to clipboard
		this.addCommand({
			id: 'copy-file-name',
			name: 'Copy file name to clipboard',
			callback: () => {
				const activeFile = this.app.workspace.getActiveFile();
				if (activeFile) {
					const fileName = activeFile.basename;
					const wrappedFileName = `[[${fileName}]]`;
					
					// Copy to clipboard
					navigator.clipboard.writeText(wrappedFileName).then(() => {
						new Notice(`Copied: ${wrappedFileName}`);
					});
				} else {
					new Notice('No active file found.');
				}
			}
		});

		// Command to open the note search modal
		this.addCommand({
			id: 'open-note-search',
			name: 'Search and copy note link to clipboard',
			callback: () => {
				new NoteSearchModal(this.app, (file: TFile) => {
					const wrappedFileName = `[[${file.basename}]]`;
					navigator.clipboard.writeText(wrappedFileName).then(() => {
						new Notice(`Copied: ${wrappedFileName}`);
					});
				}).open();
			}
		});
	}
}

// Modal to search and select notes
class NoteSearchModal extends SuggestModal<TFile> {
	onChooseCallback: (file: TFile) => void;

	constructor(app: App, onChooseCallback: (file: TFile) => void) {
		super(app);
		this.onChooseCallback = onChooseCallback;
	}

	// Get suggestions based on the query
	getSuggestions(query: string): TFile[] {
		const files = this.app.vault.getMarkdownFiles();
		return files.filter(file => file.basename.toLowerCase().includes(query.toLowerCase()));
	}

	// Render each suggestion
	renderSuggestion(file: TFile, el: HTMLElement) {
		el.createEl('div', { text: file.basename });
	}

	// Action when a suggestion is selected
	onChooseSuggestion(file: TFile) {
		this.onChooseCallback(file);
	}
}

import * as vscode from 'vscode';
import * as glob from 'glob';
import * as path from 'path';

// This method is called when your extension is activated
export function activate(context: vscode.ExtensionContext) {
    let disposable = vscode.languages.registerCompletionItemProvider(
        { language: 'html', scheme: 'file' },
        {
            provideCompletionItems(document: vscode.TextDocument, position: vscode.Position) {
                const lineText = document.lineAt(position).text;

                // Only trigger if we're typing inside a src attribute
                const srcMatch = lineText.match(/<img.*src=['"][^'"]*/);
                if (!srcMatch) {
                    return;
                }

                // Get the folder path where the extension will search for assets
                const projectRoot = vscode.workspace.workspaceFolders?.[0].uri.fsPath || '';
                const assetsFolder = path.join(projectRoot, 'public', 'assets');

                // Get all files in the assets folder
                const files = glob.sync(`${assetsFolder}/**/*.{png,jpg,jpeg,gif,svg,webp}`);

                // Create a completion item for each file
                const completionItems = files.map(file => {
                    const filePath = path.relative(projectRoot, file);
                    const completionItem = new vscode.CompletionItem(filePath, vscode.CompletionItemKind.File);
                    completionItem.insertText = `assets/${path.basename(file)}`;
                    return completionItem;
                });

                return completionItems;
            }
        },
        '"' // Trigger on quote character
    );

    context.subscriptions.push(disposable);
}

// This method is called when your extension is deactivated
export function deactivate() {}
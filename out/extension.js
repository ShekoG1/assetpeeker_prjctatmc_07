"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.activate = activate;
exports.deactivate = deactivate;
const vscode = __importStar(require("vscode"));
const glob = __importStar(require("glob"));
const path = __importStar(require("path"));
// This method is called when your extension is activated
function activate(context) {
    let disposable = vscode.languages.registerCompletionItemProvider({ language: 'html', scheme: 'file' }, {
        provideCompletionItems(document, position) {
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
    }, '"' // Trigger on quote character
    );
    context.subscriptions.push(disposable);
}
// This method is called when your extension is deactivated
function deactivate() { }
//# sourceMappingURL=extension.js.map
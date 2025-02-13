// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { ApiTreeDataProvider } from './apiTreeDataProvider';

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
	const workspaceRoot = vscode.workspace.workspaceFolders?.[0]?.uri.fsPath;
	const apiTreeDataProvider = new ApiTreeDataProvider(workspaceRoot);
	
	// Register the tree data provider
	const treeView = vscode.window.createTreeView('apiExplorer', {
		treeDataProvider: apiTreeDataProvider,
		showCollapseAll: true
	});

	// Register refresh command
	let refreshCommand = vscode.commands.registerCommand('api-companion.refreshApiView', () => {
		apiTreeDataProvider.refresh();
	});

	// Watch for file changes
	const fileWatcher = vscode.workspace.createFileSystemWatcher('**/*.{ts,js}');
	
	fileWatcher.onDidChange(() => {
		apiTreeDataProvider.refresh();
	});
	
	fileWatcher.onDidCreate(() => {
		apiTreeDataProvider.refresh();
	});
	
	fileWatcher.onDidDelete(() => {
		apiTreeDataProvider.refresh();
	});

	context.subscriptions.push(
		treeView,
		refreshCommand,
		fileWatcher
	);
}

// This method is called when your extension is deactivated
export function deactivate() {}

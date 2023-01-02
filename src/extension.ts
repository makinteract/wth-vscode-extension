import * as vscode from 'vscode';
import {
  getExplanation,
  getExplanationTest,
  explainSelection,
} from './controller';
import * as dotenv from 'dotenv';
dotenv.config({ path: __dirname + '/../.env' });
import { SideViewProvider } from './sidebarViewProvider';

let sideView: SideViewProvider;

function registerSideView(_sideView: SideViewProvider) {
  if (_sideView) {
    sideView = _sideView;
  }
}

export function activate(context: vscode.ExtensionContext) {
  // Side View
  const sideview = new SideViewProvider(context.extensionUri);
  context.subscriptions.push(
    vscode.window.registerWebviewViewProvider(
      SideViewProvider.viewType,
      sideview
    )
  );
  registerSideView(sideview);

  // Commands
  context.subscriptions.push(
    vscode.commands.registerCommand('wth.helloWorld', () => {
      vscode.window.showInformationMessage('Hello World from WTH!');
    })
  );

  context.subscriptions.push(
    vscode.commands.registerCommand(COMMAND, async () => {
      const explanation = await explainSelection();
      sideView.sendMessage({ message: explanation });
    })
  );

  context.subscriptions.push(
    vscode.languages.registerCodeActionsProvider(
      { scheme: 'file', language: 'javascript' },
      new Assistant(),
      {
        providedCodeActionKinds: Assistant.providedCodeActionKinds,
      }
    )
  );

  context.subscriptions.push(
    vscode.commands.registerCommand('wth.explain', async () => {})
  );
}

const COMMAND = 'wth.command';

export class Assistant implements vscode.CodeActionProvider {
  public static readonly providedCodeActionKinds = [
    vscode.CodeActionKind.QuickFix,
  ];

  public provideCodeActions(
    document: vscode.TextDocument,
    range: vscode.Range
  ): vscode.CodeAction[] | undefined {
    const commandAction = this.createCommand();

    return [commandAction];
  }

  private createCommand(): vscode.CodeAction {
    const action = new vscode.CodeAction(
      'Explain code',
      vscode.CodeActionKind.Empty
    );
    action.command = {
      command: COMMAND,
      title: 'Explain this code',
      tooltip: 'Explain about this code',
    };
    action.isPreferred = true;
    return action;
  }
}

export function deactivate() {}

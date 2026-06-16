export type AlgoType = 'bstPlayground';

export type StepType = 'info' | 'match' | 'mismatch' | 'found';

export interface VisualBSTNode {
  id: string;
  value: number;
  leftId: string | null;
  rightId: string | null;
  parentId: string | null;
  isNew?: boolean;
}

export interface Step {
  type: StepType;
  msg: string;
  activeNodeId?: string | null;
  bstNodes?: Record<string, VisualBSTNode>;
  bstRootId?: string | null;
  bstValue?: number;
  visitedNodes?: string[];
  callStack?: string[];
  queue?: string[];
  bstResultStatus?: string;
  highlightCodeLine?: number;
  activeOperation?: 'insert' | 'search' | 'delete' | 'inorder' | 'preorder' | 'postorder' | 'bfs';
}

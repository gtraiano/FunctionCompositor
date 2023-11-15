# FunctionCompositor
Add functions to a chain and check out the plot of their composition.

Developed with [vite](https://vitejs.dev/).<br>
Written in [React](https://reactjs.org/) and [TypeScript](typescriptlang.org/).<br>
[Live demo](https://functioncompositor.onrender.com/)

## Scripts
`npm install` to install dependencies

`npm run dev` to start the development server

`npm run build` to build (bundle) the source code

## User Flows
0. **View all nodes in the chain**<p>The chain container UI displays all nodes in order of their position in the chain. Each node is rendered in its own box.</p>
1. **Add node to chain**<p>TODO</p>
2. **Edit node**<p>The node box offers a clickable "✎" UI element (`span`) in order to display its edit UI.</p>
   - **Operations**<p>The main, pre and post operation (if defined) is each presented in a `form` that is labelled accordingly. All parameters of an operation, are displayed as either `input` or `select` elements.</p>
   - **Position**<p>The node's position in the chain is displayed at the top of the edit UI inside an accordingly labelled form. The index is rendered as a `select` element. Each option</p>
3. **Remove node from chain**<p>The node box offers an "✖" UI element (button) in order to perform removal of the node in question. The action needs to be confirmed via a popup dialog (utilizes the browser's built-in dialog).</p>
4. **Change node position in chain**
   - **Via the chain container UI**<p>The user can drag a source node and drop it to a target position in the chain. The target position node is highlighted while the source node is being dragged over it.</p>
   - **Via the node's edit UI**<p>The user can set the node's position by selecting a zero-based index `option` under the *"Position in chain"* select menu. The node's current position index option is rendered with a bold font.</p>
5. **View chain input values and their respective output values**
   - **Add new value to input**<p>TODO</p>
   - **Remove value from input**<p>TODO</p>
6. **Generate input values for given range and step**<p>TODO</p>
7. **Set plot options**<p>TODO</p>


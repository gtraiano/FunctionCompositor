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

1. **Add node to chain**
2. **Edit node operations**
3. **Remove node from chain**
4. **Change node position in chain**
   - **Via the chain UI component**<br>The user can drag a source node and drop it to a target position in the chain. The target position node is highlighted.
   - **Via the node's edit UI**
5. **View chain input values and their respective output values**
   - **Add new value to input**
   - **Remove value from input**
6. **Generate input values for given range and step**
7. **Set plot options**


import { Provider } from "react-redux";

interface ReduxProviderProps{
    children: React.ReactNode;
}
function StateProvider({children}:ReduxProviderProps) {
  return (
    <Provider store={store}>
        {children}
    </Provider>
   )
}

export default StateProvider

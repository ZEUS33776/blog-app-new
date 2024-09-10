import { UserContext } from "../App";
import { createContext, useContext,useState } from "react";
import { Navigate } from "react-router-dom";
import BlogEditor from "../components/blog-editor.component";
import PublishForm from "../components/publish-form.component";

const blogStructure = {
    title: '',
    banner: '',
    content: [],
    tags: [],
    des: '',
    author:{personal_info:{}}
}
export const EditorContext = createContext({});

export default function Editor() {
    let { userAuth: { access_token } } = useContext(UserContext)
    const [editorState, setEditorState] = useState("editor")
    const [blogState, setBlogState] = useState(blogStructure)
    const [textEditor, setTextEditor] = useState({ isReady: false });
    
    
    
    return (
        <EditorContext.Provider value={{ blogState, setBlogState, editorState, setEditorState,textEditor, setTextEditor }}>
            {
                access_token === null ? <Navigate to="/signin" />
                    : (editorState === "editor" ? <BlogEditor /> : <PublishForm />)
            }
        </EditorContext.Provider>

        
    )
}
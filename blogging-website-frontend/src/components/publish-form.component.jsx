import { Toaster, toast } from "react-hot-toast";
import AnimationWrapper from "../common/page-animation";
import { useContext } from "react";
import { EditorContext } from "../pages/editor.pages";
export default function PublishForm() {
    let { blogState: { banner, title, tags, des }, setEditorState } = useContext(EditorContext);
    const handleCloseEvent = () => {
        setEditorState("editor");
   }
    return (
        <AnimationWrapper>
            <section className="w-screen min-h-screen grid items-center lg:grid-cols-2 py-16 lg:gap-4">
                <Toaster />
                <button className="w-12 h-12 absolute right-[5vw] z-10 top-[5%] right-18 lg:top-[10%] " onClick={handleCloseEvent}>
                    <i className="fi fi-br-cross"></i>
                </button>
                <div className="max-w-[550px] center">
                    <p className="text-dark-grey mb-1">Preview</p>

                    <div className="w-full aspect-video rounded-lg overflow-hidden bg-grey mt-4">
                    
                    <img src={banner} alt="" />
                    </div>
                    <h1 className="text-4xl font-medium mt-2 leading-tight line-clamp-1">{title}</h1>
                    <p className="font-gelasio line-clamp-2 text-xl leading-7 "></p>
                </div>
                <div className="border-grey lg:border-1 lg:pl-8">
                    <p className="text-dark-grey mb-2 mt-9">Blog Title</p>
                    <input type="text" placeholder="Blog Title" defaultValue={title} className="placeholder:opacity-40 input-box pl-4 outline-none" />

                    <p className="text-dark-grey mb-2 mt-9">Short description about your blog.</p>
                    <input type="text"  className="placeholder:opacity-40 input-box pl-4 outline-none h-48 " />
                </div>
            </section>
        </AnimationWrapper>
    )
}
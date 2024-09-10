import { Link } from "react-router-dom";
import defaultBanner from "../imgs/blog banner.png"

import logo from "../imgs/logo.png"
import { AnimatePresence } from "framer-motion";
import uploadBanner from "../common/aws";
import { useRef, useEffect, useContext } from "react";
import { Toaster,toast } from "react-hot-toast";
import { EditorContext } from "../pages/editor.pages";
import EditorJS from "@editorjs/editorjs"
import { tools } from "./tools.component";

export default function BlogEditor() {
   
    const handlePublishEvent = () => {
        if (banner=== defaultBanner) {
           
            return toast.error("Upload a blog banner to publish it.")
            
        }
        if (!title.length) {
            return toast.error("Write a blog title to publish it")
        }
        console.log(textEditor.isReady);
        if (textEditor.isReady) {
            console.log("hii");
            textEditor.save().then(data => {
                if (data.blocks.length) {
                    setBlogState({ ...blogState, content: data });
                    setEditorState("publish");

                }
                else {
                    return toast.error("Write something in your blog to publish. ")
                }
            })
                .catch(err => {
                    console.log(err);
            })
        }
    }

    
    let imgbanner = useRef();
    let {blogState,blogState:{title,banner,content,tags,des},setBlogState,textEditor,setTextEditor,setEditorState }=useContext(EditorContext)
    
    useEffect(() => {
        setTextEditor(new EditorJS({
            
            holderId: "textEditor",
            data: content,
            tools:tools,
            placeholder:"Let's write something interesting..."
       }))
    },[])
   
    const handleError=() => {
        let img = e.target;
        img.src = defaultBanner;
    }
    const handleBannerUpload = (e) => {
        
        let img = e.target.files[0];
        if (img) {
            let loadingToast = toast.loading("Uploading...")
            
            uploadBanner(img).then((url) => {
                if (url) {
                    toast.dismiss(loadingToast);
                    toast.success("Uploaded.")
                    imgbanner.current.src = url
                    setBlogState(prevState => ({
                        ...prevState,
                        banner: url
                    }));
                }
            });
        }
    }
    let textArea = useRef(null);
    const reSize = (event) => {
        let input = event.target;
        
        textArea.current.style.height = 'auto';
        textArea.current.style.height = `${textArea.current.scrollHeight}px`;
        setBlogState({...blogState,title:input.value})

        console.log(event.target.value);
       
        
        


    }
    const handleKeyDown = (e) => {
        if (e.keyCode === 13) {
            e.preventDefault();
        }
    }
    


    return (
            
            <>
            <Toaster />
                <nav className="navbar">
                    <Link to="/" className="flex-none w-10">
                        <img src={logo} alt="" />
            
                    </Link>
                <p className="text-black">{
                     title.length===0?"New Blog":title
                }

                </p>
                <div className="flex gap-4 ml-auto">
                    
                    <button
                        className="btn-dark py-2"
                        onClick={handlePublishEvent}
                        >
                            Publish
                        </button >
                        <button className="btn-light py-2">
                            Save Draft
                        </button>
                    </div>

                </nav>
                <AnimatePresence>
                    <div className="mx-auto max-w-[900px] w-full" >
                        <div className="relative aspect-video bg-white border-4 border-grey hover:opacity-80">
                        <label htmlFor="uploadBanner">
                            
                                <img  src={banner?banner:defaultBanner} onError={handleError} ref={imgbanner}  className="z-20" alt="" />
                                <input
                                    id="uploadBanner"
                                    type="file"
                                    accept=".png, .jpg, .jpeg"
                                    hidden
                                    onChange={handleBannerUpload}
                                />
                            </label>

                        </div>
                        <textarea placeholder="Title" defaultValue={title} name="" ref={textArea}  className=" resize-none overflow-hidden p-2 w-full text-4xl placeholder:opacity-40 font-normal text-dark-grey mx-auto border-4 border-white border-transparent mt-5 h-50 focus:outline-none" onKeyDown={handleKeyDown} onChange={reSize}  >

                    </textarea>
                    <hr className="w-full opacity-10 my-5" />
                    <div id="textEditor" className=" font-gelasio"></div>
                    </div>

            
                </AnimatePresence>
               
            </>
            
        )
    }

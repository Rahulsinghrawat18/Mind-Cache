import { useRef, useState } from "react";
import { CrossIcon } from "../icons/CrossIcon";
import { Button } from "./Button";
import { UseClickOutside } from "../hooks/UseClickOutside";
import { Input } from "./Input";
import { BACKEND_URL } from "../config";
import axios, { AxiosError } from "axios";

enum ContentType {
  Youtube = "youtube",
  Twitter = "twitter"
}

export function CreateComponentModal({open, onCLose}) {
  const titleRef = useRef<HTMLInputElement>(null);
  const linkRef = useRef<HTMLInputElement>(null);
  const [type, setType] = useState(ContentType.Youtube);

  const [message, setMessage] = useState<string | null>(null);
  const [messageType, setMessageType] = useState<"success" | "error" | null>(null);

  async function addContent(){
    const title = titleRef.current?.value;
    const link = linkRef.current?.value;

    try {
          await axios.post(`${BACKEND_URL}/api/v1/content`, {
            link,
            title,
            type
          }, {
            headers: {
              "Authorization": localStorage.getItem("token")
            }
          })
          setMessage("✔️ Content added successfully!");
          setMessageType("success");

    // Close modal after success
            setTimeout(() => {
              onCLose();
              setMessage(null);
              setMessageType(null);
            }, 1000);          
        }
        
        catch (error) {
          console.error("Error adding content:", error);
      
          // Typecast error to AxiosError
          const axiosError = error as AxiosError<{ message: string }>;
      
          if (axiosError.response && axiosError.response.data.message.includes("!ContentTypes")) {
            setMessage("❌ Invalid Type! Please select a valid content type.");
          } else {
            setMessage("❌ Failed to add content. Try again.");
          }
      
          setMessageType("error");
        }
      
        // Clear message after 3 seconds
        setTimeout(() => {
          setMessage(null);
          setMessageType(null);
        }, 3000);
      }
      

  const modalRef = useRef(null);
  UseClickOutside(modalRef, onCLose);
  if(!open){
    return null;
  }


  return (
    <div>
      {open && (
        <div className="w-screen h-screen bg-slate-200 fixed top-0 left-0 bg-opacity-60 flex justify-center">
          <div ref={modalRef} className="flex flex-col justify-center">
            <span className="bg-green-950 text-black opacity-100 p-4 rounded">
              <div className="flex justify-end">
                <div onClick={onCLose} className="cursor-pointer">
                  <CrossIcon />
                </div>
              </div>

              <div>
                <Input ref={titleRef} placeholder={"Title"} />
                <Input ref={linkRef} placeholder={"Link"} />
              </div>

              <div className="m-2">
                <h1 className="text-white flex justify-center">Type</h1>
                <div className="flex gap-1 p-4">
                  <Button
                    text="Youtube"
                    variant={type === ContentType.Youtube ? "submit" : "secondary"}
                    onClick={() => setType(ContentType.Youtube)}
                  />
                  <Button
                    text="Twitter"
                    variant={type === ContentType.Twitter ? "submit" : "secondary"}
                    onClick={() => setType(ContentType.Twitter)}
                  />
                </div>
              </div>

              <div className="flex items-center justify-center m-2">
                <Button onClick={addContent} variant="submit" text="Submit" />
              </div>
            </span>

            {/* ✅ Success/Error Popup */}
            {message && (
              <div className={`fixed bottom-10 left-1/2 transform -translate-x-1/2 px-4 py-2 rounded shadow-lg
                ${messageType === "success" ? "bg-green-500 text-white" : "bg-red-500 text-white"}`}>
                {message}
              </div>
            )}

          </div>
        </div>
      )}
    </div>
  );
}





//   return <div>
//     {open && <div className="w-screen h-screen bg-slate-200
//     fixed top-0 left-0 bg-opacity-60 flex justify-center">

//       <div ref={modalRef} className="flex flex-col justify-center">
//         <span className="bg-green-950 text-black opacity-100
//          p-4 rounded">
          
//           <div className="flex justify-end">
//             <div onClick={onCLose} className="cursor-pointer">
//               <CrossIcon />
//             </div>
//           </div>

//             <div>
//               <Input ref={titleRef} placeholder={"Title"}/>
//               <Input ref={linkRef} placeholder={"Link"}/>
//             </div>

//             <div className="m-2">
//               <h1 className="text-white flex justify-center">Type</h1>
//               <div className="flex gap-1 p-4">
//               <Button text="Youtube" variant={type ===
//                 ContentType.Youtube ? "submit":"secondary"
//               } onClick={() =>{
//                 setType(ContentType.Youtube)
//               }} />

//               <Button text="Twitter" variant={type ===
//                 ContentType.Twitter ? "submit":"secondary"
//               } onClick={() => {
//                 setType(ContentType.Twitter)
//               }} />              
//             </div>
//           </div>
          

//             <div className="flex items-center justify-center m-2">
//             <Button onClick={addContent} variant="submit" text="Submit"/>
//             </div>
//         </span>

//             {/* ✅ Success/Error Popup */}
//             {message && (
//               <div className={`fixed bottom-10 left-1/2 transform -translate-x-1/2 px-4 py-2 rounded shadow-lg
//                 ${messageType === "success" ? "bg-green-500 text-white" : "bg-red-500 text-white"}`}>
//                 {message}
//               </div>
//             )}
    

//       </div>

//     </div>}
//   </div>
// }


import { LinkIcon } from "../icons/LinkIcon";
import { DocumentIcon } from "../icons/DocumentIcon";
import { Twitter } from "../icons/Twitter";
import { YoutubeIcon } from "../icons/YoutubeIcon";
import { SidebarItem } from "./SidebarItem";
import { Tags } from "../icons/Tags";

export function Sidebar() {
  return <div className="h-screen bg-white border-r w-72
  fixed left-0 top-0 pl-6">
    <div className="flex text-2xl pt-4 items-center text-gray-700">
    <img src="   https://cdn-icons-png.flaticon.com/512/109/109827.png "
     width="40" height="40" alt="Brain"
     className="img-small p-1"/>
      MindCache
    </div>
    <div className="pt-8 pl-4">
      <SidebarItem text="Tweets" icon={<Twitter/>}/>
      <SidebarItem text="Videos" icon={<YoutubeIcon/>}/>
      <SidebarItem text="Documents" icon={<DocumentIcon/>}/>
      <SidebarItem text="Links" icon={<LinkIcon/>}/>
      <SidebarItem text="Tags" icon={<Tags/>} />
    </div>
  </div>
}
import { useEffect, useState } from "react"
import { Button } from "../components/Button"
import { Card } from "../components/Card"
import { CreateComponentModal } from "../components/CreateComponentModal"
import { PlusIcon } from "../icons/PlusIcon"
import { ShareIcon } from "../icons/ShareIcon"
import { Sidebar } from "../components/Sidebar"
import { useContent } from "../hooks/useContent"

export function Dashboard() {
  const [modalOpen, setModalOpen] = useState(false);
  const {contents, refresh} = useContent();

  useEffect(() =>{
    refresh();
  }, [modalOpen, refresh])

  return (
    <div>
     <Sidebar/>

      <div className="p-4 ml-72
          min-h-screen bg-gray-200
          border-2"
      >
      <CreateComponentModal open={modalOpen} onCLose={() => {
        setModalOpen(false)
      }}/>

      <div className="font-semibold text-2xl">All Notes</div>
      <div className="flex justify-end gap-4">

        <Button onClick={() => {
          setModalOpen(true)
        }} variant="primary" text="Add Content"
        startIcon={<PlusIcon/>}></Button>

        <Button variant="secondary" text="Share Brain"
        startIcon={<ShareIcon/>}></Button>
      </div>

      <div className="flex gap-4 flex-wrap">
        {/* {JSON.stringify(contents)} */}
        {contents.map(({type, link, title})=> <Card
        type={type}
        link={link}
        title={title}
        />)}
      </div>

      </div> 
    </div>   
  )
}

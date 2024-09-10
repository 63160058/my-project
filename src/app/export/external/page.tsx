// import Image from "next/image";
import Navbar from "../../componente/Navbar";
import SearchableTable from "../../componente/SearchableTable";
// import { Button } from "@/components/ui/button"

export default function Home() {
  return (
    <main>
      <Navbar />
      {/* <Button>Click me</Button> */}
      <h1 style={{ padding: "20px" }}>ชื่อวิจัย การพัฒนาระบบการจัดเก็บข้อมูลหนังสือราชการ</h1>
      <SearchableTable />
    </main>
  );
}
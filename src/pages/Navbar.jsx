import { useNavigate } from "react-router-dom"

export default function Navbar() {
    const navigate = useNavigate()
    const token = localStorage.getItem('tokenLogin')
    const handleLogout = () => {
        localStorage.clear('tokenLogin')
        localStorage.clear('media')
        window.location.reload()
    }
    return (
        <nav className="flex justify-between py-3.5 px-2 bg-gray-400 static"><span className="text-gray-700 font-bold text-xl my-auto" onClick={() => navigate("/quotes")}>Quotes</span>
            {token && <button className="bg-white px-2.5 py-2 rounded-xl text-lg font-semibold" onClick={handleLogout}>Sign out</button>}
        </nav>
    )
}

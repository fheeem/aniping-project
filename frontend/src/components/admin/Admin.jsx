import { Routes, Route } from "react-router-dom";

import './Admin.css'

const Admin = () => {

    return (
        <div id="Admin">
            <Routes>
                <Route path='/adList' element={<AdList />} />
            </Routes>

        </div>
    )

}

export default Admin;
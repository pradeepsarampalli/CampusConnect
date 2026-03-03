import { useEffect, useMemo, useState } from 'react';
import { FiEdit2, FiTrash2 } from "react-icons/fi";
import '../css/Notices.css';

function formatDate(value) {
    if (!value) return '';
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return '';
    return date.toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
    });
}

function Notices() {
    const [notices, setNotices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [search, setSearch] = useState('');
    const [filter, setFilter] = useState('all');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingNotice, setEditingNotice] = useState(null);
    const [formData, setFormData] = useState({id:"",title: "",description: "",pinned: false});

    const handleDelete = async (id) => {
    try {
        await fetch(`http://localhost:3001/api/notices/${id}`,{method: "DELETE",credentials: "include",});
        setNotices(prev=>prev.filter(n=>n._id!==id));
    } catch (err) {
        console.error("Delete failed");
    }};

    const handleEditClick=async (notice)=>{
    setEditingNotice(notice);
    setFormData({id:notice._id,title: notice.title,description: notice.description,pinned: notice.pinned
    });
    setIsModalOpen(true);
};
    const handleChange = (e) => {
    const { name,value,type,checked }=e.target;
    setFormData(prev=>({...prev,[name]:type==="checkbox"?checked:value
    }));
};

    const editNotice = async (id)=>{
        try{
            const res = await fetch(`http://localhost:3001/api/notices/${id}`,{
            method:"PUT",
            headers:{
                "Content-Type": "application/json"
            },credentials: "include",
            body: JSON.stringify({
                title:formData.title,
                description:formData.description,
                pinned:formData.pinned
            })
        });
        const updated =await res.json();
        setNotices(prev =>
            prev.map(n => n._id===id?updated:n)
        );
        setIsModalOpen(false);
        }
        catch(err){
            console.error("Update failed");
        }
    }

    useEffect(() => {
        let isMounted = true;
        async function loadNotices() {
            try {
                const res = await fetch('http://localhost:3001/api/notices',{credentials: "include",});
                const data = await res.json();
                if (!res.ok) {
                    throw new Error(data.message || 'Failed to load notices');
                }
                if (!isMounted) return;

                const sorted = [...data].sort((a, b) => {
                    const aPinned = a.pinned;
                    const bPinned = b.pinned;

                    if (aPinned!==bPinned) {
                        return aPinned ? -1 : 1;
                    }

                    const aDate = new Date(a.createdAt || 0).getTime();
                    const bDate = new Date(b.createdAt || 0).getTime();
                    return bDate - aDate;
                });

                setNotices(sorted);
                setLoading(false);
            } catch (err) {
                if (!isMounted) return;
                setError(err.message || 'Failed to load notices');
                setLoading(false);
            }
        }
        loadNotices();
        return () => {
            isMounted = false;
        };
    }, []);

    const filteredNotices = useMemo(() => {
        return notices.filter((notice) => {
            if (filter === 'pinned' && !notice.pinned) return false;
            if (!search.trim()) return true;

            const text = `${notice.title || ''} ${notice.description || ''}`.toLowerCase();
            return text.includes(search.toLowerCase());
        });
    }, [notices, search, filter]);

    return (
        <div className="notices-page">
            <div className="notices-header">
                <h1>College Notices</h1>
                <p>Important announcements and updates</p>
            </div>

            <div className="notices-controls">
                <input
                    type="text"
                    className="notices-search"
                    placeholder="Search notices"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
                <div className="notices-filters">
                    <button
                        type="button"
                        className={`notices-filter-btn ${filter === 'all' ? 'active' : ''}`}
                        onClick={() => setFilter('all')}
                    >
                        All
                    </button>
                    <button
                        type="button"
                        className={`notices-filter-btn ${filter === 'pinned' ? 'active' : ''}`}
                        onClick={() => setFilter('pinned')}
                    >
                        Pinned
                    </button>
                </div>
            </div>
            {error && !loading && <p className="notices-status error">{error}</p>}
            {loading && (
                <div className="notices-grid">
                    {Array.from({ length: 3 }).map((_, idx) => (
                        <div key={idx} className="notice-card skeleton">
                            <div className="skeleton-line short" />
                            <div className="skeleton-line" />
                            <div className="skeleton-line" />
                        </div>
                    ))}
                </div>
            )}

            {!loading && !error && filteredNotices.length === 0 && (
                <div className="notices-empty">No notices available.</div>
            )}

            {!loading && !error && filteredNotices.length > 0 && (

<div className="notices-grid">
    {filteredNotices.map((notice) => (
        <div key={notice._id || notice.id}
            className={`notice-card ${notice.pinned ? 'pinned' : ''}`}>
            <div className="notice-actions">
                <button className="action-btn edit" title="Edit" onClick={() => handleEditClick(notice)}><FiEdit2 /></button>
                <button className="action-btn delete" title="Delete" onClick={()=>handleDelete(notice.id || notice._id)}><FiTrash2 /></button>
            </div>
            {notice.pinned && <span className="notice-badge">Pinned</span>}
            <div className="notice-date">
                {formatDate(notice.createdAt)}
            </div>
            <h3>{notice.title}</h3>
            <p>{notice.description}</p>
        </div>
    ))}
</div>
            )}
    {isModalOpen && (
    <div className="modal-overlay">
        <div className="modal">
            <h2>Edit Notice</h2>
            <input type="text" name="title" value={formData.title} onChange={handleChange}placeholder="Title"/>
            <textarea name="description" value={formData.description} onChange={handleChange} placeholder="Description"/>
            <label className="modal-checkbox">
                <input type="checkbox" name="pinned" checked={formData.pinned} onChange={handleChange}/>Pinned
            </label>
            <div className="modal-actions">
                <button className="cancel-btn"onClick={() => setIsModalOpen(false)}>Cancel
                </button>
                <button className="save-btn" onClick={()=>editNotice(formData.id)}>Save Changes</button>
            </div>
        </div>
    </div>
)}
        </div>
    );
}

export default Notices;
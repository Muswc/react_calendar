import React, { useState, useEffect } from 'react';
import { FaPlus, FaTimes } from 'react-icons/fa';

const Bookmark = () => {
  const [bookmarks, setBookmarks] = useState(() => {
    // localStorage에서 bookmarks 데이터 불러오기
    const savedBookmarks = localStorage.getItem('bookmarks');
    return savedBookmarks ? JSON.parse(savedBookmarks) : [];
  });
  const [isAdding, setIsAdding] = useState(false);
  const [newBookmark, setNewBookmark] = useState({ title: '', url: '' });

  // bookmarks가 변경될 때마다 localStorage에 저장
  useEffect(() => {
    localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
  }, [bookmarks]);

  // 북마크 추가 버튼 클릭 시 클립보드 내용 가져오기
  const handleAddClick = async () => {
    try {
      const clipboardText = await navigator.clipboard.readText();
      // URL 형식인지 확인
      if (clipboardText.match(/^(http|https):\/\//)) {
        setNewBookmark({ ...newBookmark, url: clipboardText });
      }
    } catch (err) {
      console.log('클립보드 접근 실패:', err);
    }
    setIsAdding(true);
  };

  const handleAdd = () => {
    if (newBookmark.url) {
      // URL에서 favicon 가져오기
      const favicon = `https://www.google.com/s2/favicons?domain=${newBookmark.url}&sz=32`;
      setBookmarks([...bookmarks, { ...newBookmark, favicon }]);
      setNewBookmark({ title: '', url: '' });
      setIsAdding(false);
    }
  };

  const handleDelete = (index) => {
    const newBookmarks = bookmarks.filter((_, i) => i !== index);
    setBookmarks(newBookmarks);
    localStorage.setItem('bookmarks', JSON.stringify(newBookmarks));
  };

  return (
    <div className="bookmark-grid">
      {bookmarks.map((bookmark, index) => (
        <div key={index} className="bookmark-item-wrapper">
          <a
            href={bookmark.url}
            target="_blank"
            rel="noopener noreferrer"
            className="bookmark-item"
          >
            <button 
              className="bookmark-delete-button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                handleDelete(index);
              }}
            >
              <FaTimes size={14} />
            </button>
            <img src={bookmark.favicon} alt={bookmark.title} />
            <span className="bookmark-title">{bookmark.title}</span>
          </a>
        </div>
      ))}
      <button 
        className="add-bookmark-button"
        onClick={handleAddClick}
      >
        <FaPlus size={32} />
        <span className="bookmark-title">추가</span>
      </button>

      {isAdding && (
        <div className="bookmark-modal">
          <div className="bookmark-modal-content">
            <h3>북마크 추가</h3>
            <input
              type="text"
              placeholder="사이트 이름"
              value={newBookmark.title}
              onChange={(e) => setNewBookmark({...newBookmark, title: e.target.value})}
            />
            <input
              type="url"
              placeholder="URL (https://...)"
              value={newBookmark.url}
              onChange={(e) => setNewBookmark({...newBookmark, url: e.target.value})}
            />
            <div className="bookmark-modal-buttons">
              <button onClick={handleAdd}>추가</button>
              <button onClick={() => {
                setIsAdding(false);
                setNewBookmark({ title: '', url: '' });
              }}>취소</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Bookmark; 
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Quote = () => {
  const [quote, setQuote] = useState(null);

  useEffect(() => {
    const fetchQuote = async () => {
      try {
        const response = await axios.get('https://korean-advice-open-api.vercel.app/api/advice');
        setQuote(response.data);
      } catch (error) {
        console.error('명언을 가져오는데 실패했습니다:', error);
      }
    };

    fetchQuote();
  }, []);

  if (!quote) return null;

  return (
    <div className="quote-container">
      <p className="quote-message">{quote.message}</p>
      <div className="quote-author">
        <span>{quote.author}</span>
        {quote.authorProfile && <span className="quote-profile">{quote.authorProfile}</span>}
      </div>
    </div>
  );
};

export default Quote; 
import React from 'react'

interface LostAndFoundProps {
  mode: "light" | "dark";
  toggleMode: () => void;
}

const LostAndFound: React.FC<LostAndFoundProps> = ({ mode, toggleMode }) => {
  return (
    <div>
      lostandfound
    </div>
  )
}

export default LostAndFound;
import React from 'react'

export default function AddButton({onClick}) {
  return (
    <div className="mt-4">
            <button
                type="button"
                className="bg-green-500 text-white rounded-md px-4 py-2 text-sm font-medium hover:bg-green-600"
                onClick={(e)=>{
                    e.preventDefault();
                    onClick();}}
            >
                Add Medicine
            </button>
        </div>
  )
}


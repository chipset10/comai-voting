import React from 'react';

const Header = (props) => {
  const shortenAddress = (address) => {
    return `${address.slice(0, 4)}...${address.slice(
      address.length - 4,
      address.length
    )}`;
  }
  return (
    <header className="flex flex-col md:flex-row items-center justify-between gap-4">

        <h1 className="text-2xl md:text-3xl font-bold">
            Hey, <span className="text-primary-100">{props.name}</span>
        </h1>
        <div className="hidden md:block bg-gray-800 text-white rounded-2xl py-2 px-2 md:auto">
                    <h1 className="text-green-400 text-sm font-bold " >{shortenAddress(props.address)}</h1>
                </div>
    </header>
  )
}

export default Header
const Navbar = () => {
    return (
      <nav className="bg-gray-800 text-white p-4">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <a href="/" className="text-2xl font-bold">FAQ Portal</a>
          <div>
            <a href="/faqs" className="text-lg hover:text-gray-400 ml-4">FAQs</a>
          </div>
        </div>
      </nav>
    );
  };
  
  export default Navbar;
  
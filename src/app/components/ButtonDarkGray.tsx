type ButtonProps = {
  children: React.ReactNode;
};

export default function ButtonDarkGray({ children }: ButtonProps) {
  return (
    <button className="py-2 px-4 bg-darkGray w-full sm:w-fit text-white font-medium rounded-xl outline outline-1 outline-darkGray hover:bg-white hover:text-darkGray duration-200 transition-colors">
      {children}
    </button>
  );
}

type ButtonProps = {
  children: React.ReactNode;
};

export default function ButtonDarkGray({ children }: ButtonProps) {
  return (
    <button className="py-2 px-4 bg-primaryBlue text-white font-medium rounded-xl outline outline-1 outline-primaryBlue hover:bg-white hover:text-primaryBlue duration-200 transition-colors">
      {children}
    </button>
  );
}

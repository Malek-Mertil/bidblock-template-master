"use client";
import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
/* Images */
import logo from "../../../public/images/logo/logo-navbar.png";
/* Icons */
import { CiLocationArrow1 } from "react-icons/ci";
import { CiUser } from "react-icons/ci";
import { IoMdSearch } from "react-icons/io";
import { MdOutlineShoppingBag } from "react-icons/md";
import { MdOutlineClose } from "react-icons/md";

/* Comp */
import ButtonDarkGray from "./ButtonDarkGray";
import ButtonPrimaryBlue from "./ButtonPrimaryBlue";

export default function Header() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const modal = modalRef.current;
    if (!modal) return;

    if (isModalOpen) {
      requestAnimationFrame(() => {
        modal.classList.replace("translate-y-full", "translate-y-0");
      });
    }
  }, [isModalOpen]);

  const closeModal = () => {
    const modal = modalRef.current;
    if (!modal) return;

    modal.classList.replace("translate-y-0", "translate-y-full");
    setIsModalOpen(false);
  };

  return (
    <header className="fixed top-0 z-50 w-full bg-white">
      {/* Desktop */}
      <div className="relative mx-auto max-w-8xl px-6 xl:px-12 2xl:px-0 h-24 lg:flex items-center justify-between hidden  ">
        <div className="flex flex-row items-center gap-4">
          <Link href="/">
            <Image src={logo} alt="LOGO" />
          </Link>
        </div>
        {/* Links */}
        <nav className="flex gap-4">
          <Link
            href=""
            className="text-darkGray font-medium relative before:absolute before:bottom-0 before:w-full before:bg-none before:h-0.5 hover:before:bg-darkGray before:duration-200 before:transition-colors"
          >
            Évènements
          </Link>
          <Link
            href=""
            className="text-darkGray font-medium relative before:absolute before:bottom-0 before:w-full before:bg-none before:h-0.5 hover:before:bg-darkGray before:duration-200 before:transition-colors"
          >
            Vente
          </Link>
        </nav>
        {/* Buttons */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1 cursor-pointer group relative">
            <CiLocationArrow1 className="size-8 fill-primaryBlue" />
            <div className="lg:absolute lg:-bottom-14 rounded-md lg:bg-white lg:drop-shadow-md lg:p-4 lg:-translate-x-1/2 lg:left-1/2 lg:invisible lg:opacity-0 lg:group-hover:visible lg:group-hover:opacity-100 lg:transition-[opacity,visibility] lg:duration-200 lg:delay-100">
              <p className="relative whitespace-nowrap font-normal text-sm text-primaryBlue before:absolute before:bottom-0 before:w-full before:bg-none before:h-px hover:before:bg-primaryBlue before:duration-200 before:transition-colors">
                Activer la localisation
              </p>
            </div>
          </div>
          <div className="relative border border-darkGray py-2 px-2 rounded-xl flex items-center gap-1 group">
            <IoMdSearch className="size-6 " />
            <input
              type="text"
              placeholder="Search"
              className="font-light outline-0 placeholder:opacity-0 max-w-0 group-hover:placeholder:opacity-100 group-hover:max-w-32 transition-max-width group-hover:placeholder:transition-opacity group-hover:placeholder:duration-500 duration-200"
            />
          </div>
          <ButtonDarkGray>Vendre</ButtonDarkGray>
          <div className="group">
            <div
              onClick={() => setIsModalOpen(true)}
              className="flex items-center justify-center cursor-pointer gap-0.5 border border-darkGray py-2 px-4 rounded-xl hover:bg-darkGray hover:text-white duration-200"
            >
              EN / USD
            </div>

            {/* Modal */}
            {isModalOpen && (
              <div className="backdrop-blur-sm h-screen w-screen right-0 fixed flex items-center justify-center bottom-0 z-50">
                <div
                  ref={modalRef}
                  className="bg-white flex flex-col items-center px-14 rounded-2xl py-10 gap-5 drop-shadow-md transform translate-y-full transition-transform duration-300 ease-out"
                >
                  <MdOutlineClose
                    onClick={closeModal}
                    className="self-end size-8 cursor-pointer hover:rotate-90 duration-300"
                  />

                  {/* Language */}
                  <div className="flex flex-col gap-5">
                    <h1 className="text-2xl font-medium">
                      Choisir votre langue
                    </h1>
                    <div className="space-y-1">
                      <div>
                        <input
                          type="radio"
                          name="langue"
                          id="langue_anglais"
                          className="hidden peer"
                        />
                        <label
                          htmlFor="langue_anglais"
                          className="peer-checked:text-primaryBlue cursor-pointer"
                        >
                          Anglais
                        </label>
                      </div>
                      <div>
                        <input
                          type="radio"
                          name="langue"
                          id="langue_français"
                          className="hidden peer"
                        />
                        <label
                          htmlFor="langue_français"
                          className="peer-checked:text-primaryBlue cursor-pointer"
                        >
                          Français
                        </label>
                      </div>
                    </div>
                  </div>

                  <div className="w-full h-px bg-black/10"></div>

                  {/* Currency  */}
                  <div className="flex flex-col gap-5">
                    <h1 className="text-2xl font-medium">
                      Choisir votre devise
                    </h1>
                    <div className="space-y-1">
                      <div>
                        <input
                          type="radio"
                          name="devise"
                          id="usd"
                          className="hidden peer"
                        />
                        <label
                          htmlFor="usd"
                          className="peer-checked:text-primaryBlue cursor-pointer"
                        >
                          USD
                        </label>
                      </div>
                      <div>
                        <input
                          type="radio"
                          name="devise"
                          id="euro"
                          className="hidden peer"
                        />
                        <label
                          htmlFor="euro"
                          className="peer-checked:text-primaryBlue cursor-pointer"
                        >
                          EUR
                        </label>
                      </div>
                    </div>
                  </div>
                  <button className="self-end bg-primaryBlue text-white px-5 py-2 rounded-lg">
                    Enregistrer
                  </button>
                </div>
              </div>
            )}
          </div>
          <Link href="">
            <ButtonPrimaryBlue>
              <CiUser className="size-6 stroke-[1.5px]" />
            </ButtonPrimaryBlue>
          </Link>
          <Link href="" className="flex items-center gap-1 cursor-pointer">
            <MdOutlineShoppingBag className="size-6" />
            <span>(0)</span>
          </Link>
        </div>
      </div>

      {/* Mobile */}
      <div className="lg:hidden flex items-center justify-between h-20 relative mx-auto max-w-8xl px-6 ">
        <div className="flex items-center gap-4">
          <Link href="/">
            <Image src={logo} alt="LOGO" className="w-28 h-auto" />
          </Link>
        </div>
        {/* Right side (icons) */}
        <button
          onClick={() => setIsMobileMenuOpen(true)}
          className="flex flex-col gap-3"
        >
          <div className="h-0.5 w-12 bg-black"></div>
          <div className="h-0.5 w-12 bg-black"></div>
        </button>
      </div>
      {/* Background overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-40 transition-opacity duration-200"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
      {/* Mobile menu */}
      <div
        className={`fixed top-0 left-0 h-full w-full sm:w-[500px] bg-white z-50 duration-200 lg:hidden shadow-md transform  ${
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex justify-between items-center mb-5 sm:mb-10 p-4">
          <h1 className="text-xl font-medium">Menu</h1>
          <button onClick={() => setIsMobileMenuOpen(false)}>
            <MdOutlineClose className="size-8" />
          </button>
        </div>
        {/* Links */}
        <nav className="flex flex-col px-4">
          <Link
            href=""
            className="text-darkGray font-medium relative before:absolute before:bottom-0 before:w-full before:bg-none before:h-0.5 hover:before:bg-darkGray before:duration-200 before:transition-colors border-b py-3"
          >
            Acceuil
          </Link>
          <Link
            href=""
            className="text-darkGray font-medium relative before:absolute before:bottom-0 before:w-full before:bg-none before:h-0.5 hover:before:bg-darkGray before:duration-200 before:transition-colors border-b py-3"
          >
            Évènements
          </Link>
          <Link
            href=""
            className="text-darkGray font-medium relative before:absolute before:bottom-0 before:w-full before:bg-none before:h-0.5 hover:before:bg-darkGray before:duration-200 before:transition-colors border-b py-3"
          >
            Vente
          </Link>
        </nav>
        {/* Buttons */}
        <div className="px-4">
          <Link
            href=""
            className="flex items-center gap-1 text-darkGray font-light relative before:absolute before:bottom-0 before:w-full before:bg-none before:h-0.5 hover:before:bg-darkGray before:duration-200 before:transition-colors border-b py-3"
          >
            <CiUser className="size-4 stroke-[1px]" />
            <span> S&lsquo;inscrire </span>
          </Link>
          <Link
            href=""
            className="flex items-center gap-1 text-darkGray font-light relative before:absolute before:bottom-0 before:w-full before:bg-none before:h-0.5 hover:before:bg-darkGray before:duration-200 before:transition-colors border-b py-3 "
          >
            <MdOutlineShoppingBag className="size-4" />
            Pannier
            <span>(0)</span>
          </Link>
          <div className="flex items-center gap-1 text-darkGray font-light relative before:absolute before:bottom-0 before:w-full before:bg-none before:h-0.5 hover:before:bg-darkGray before:duration-200 before:transition-colors border-b py-3">
            <IoMdSearch className="size-4 " />
            <input
              type="text"
              placeholder="Search"
              className="font-light outline-0 "
            />
          </div>
          <div className="py-3">
            <ButtonDarkGray>Vendre</ButtonDarkGray>
          </div>
        </div>
        <div>
          <div>
            <div className="px-4 bg-lightGray py-2">
              <h1>Langue</h1>
            </div>
            <div className="flex gap-5 p-4">
              <div>
                <input
                  type="radio"
                  name="langue"
                  id="langue_anglais"
                  className="hidden peer"
                />
                <label
                  htmlFor="langue_anglais"
                  className="peer-checked:text-primaryBlue cursor-pointer"
                >
                  Anglais
                </label>
              </div>
              <div>
                <input
                  type="radio"
                  name="langue"
                  id="langue_français"
                  className="hidden peer"
                />
                <label
                  htmlFor="langue_français"
                  className="peer-checked:text-primaryBlue cursor-pointer"
                >
                  Français
                </label>
              </div>
            </div>
          </div>
          <div>
            <div className="px-4 bg-lightGray py-2">
              <h1>Devise</h1>
            </div>
            <div className="flex gap-5 p-4">
              <div>
                <input
                  type="radio"
                  name="devise"
                  id="usd"
                  className="hidden peer"
                />
                <label
                  htmlFor="usd"
                  className="peer-checked:text-primaryBlue cursor-pointer"
                >
                  USD
                </label>
              </div>
              <div>
                <input
                  type="radio"
                  name="devise"
                  id="euro"
                  className="hidden peer"
                />
                <label
                  htmlFor="euro"
                  className="peer-checked:text-primaryBlue cursor-pointer"
                >
                  EUR
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

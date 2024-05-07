import Image from "next/image";
import Link from "next/link";
import React from "react";

const HeaderLogo = () => {
  return (
    <Link href={"/"}>
      <div className="items-center hidden lg:flex">
        <Image
          src={"/logo-finance.svg"}
          alt="logo finance"
          height={28}
          width={28}
        />
        <p className="font-semibold text-white text-2xl ml-2.5">
          Globe Finanças
        </p>
      </div>
    </Link>
  );
};

export default HeaderLogo;

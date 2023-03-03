import React from "react";
import { signIn, signOut, useSession } from "next-auth/react";

const Header = () => {
  const { data: sessionData } = useSession();

  return (
    <>
      <div className="navbar bg-primary text-primary-content">
        <div className="flex-1 pl-5 text-3xl font-bold text-white">
          {sessionData?.user?.name ? `Notes for ${sessionData.user.name}` : ""}
        </div>
        <div className="flex-row gap-2">
          <div className="dropdown-end dropdown">
            {sessionData?.user ? (
              <>
                <div className="btn-ghost btn-circle avatar btn mr-5">
                  <div className="w-20 rounded-full align-middle">
                    <img
                      src={sessionData?.user?.image ?? ""}
                      alt={sessionData?.user?.name ?? ""}
                    />
                  </div>
                </div>
                <button
                  className="btn-sm btn mt-2.5 align-top text-white"
                  onClick={() => void signOut()}
                >
                  Log Out
                </button>
              </>
            ) : (
              <>
                <button
                  className="btn-ghost rounded-btn btn text-white"
                  onClick={() => {
                    void signIn();
                  }}
                >
                  Sign in
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Header;

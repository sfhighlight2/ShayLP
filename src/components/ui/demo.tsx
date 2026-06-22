
function Component() {
  return (
    <div className="flex items-center rounded-full bg-white/[0.04] p-1 shadow shadow-black/5 max-w-fit mt-4">
      <div className="flex -space-x-1.5">
        <img
          className="rounded-full ring-1.5 ring-[#170006] object-cover h-5 w-5"
          src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=80&h=80&q=80"
          width={20}
          height={20}
          alt="Coached Client 01"
        />
        <img
          className="rounded-full ring-1.5 ring-[#170006] object-cover h-5 w-5"
          src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=80&h=80&q=80"
          width={20}
          height={20}
          alt="Coached Client 02"
        />
        <img
          className="rounded-full ring-1.5 ring-[#170006] object-cover h-5 w-5"
          src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=80&h=80&q=80"
          width={20}
          height={20}
          alt="Coached Client 03"
        />
        <img
          className="rounded-full ring-1.5 ring-[#170006] object-cover h-5 w-5"
          src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=80&h=80&q=80"
          width={20}
          height={20}
          alt="Coached Client 04"
        />
      </div>
      <p className="px-2.5 text-[12px] text-[#FFF7EE]/70">
        Trusted by <strong className="font-semibold text-[#E8B75A]">2,000+</strong> coached women.
      </p>
    </div>
  );
}

export { Component };

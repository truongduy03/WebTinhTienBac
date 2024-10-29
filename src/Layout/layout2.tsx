const Layout = () => {
  return (
    <div className="flex justify-center mt-5">
      <div className=" flex flex-col w-[50%] h-[70%] border-2 rounded">
        <div className="bg-sky-400 text-center">
          <h1 className=" text-white text-5xl m-10">
            Chức nắng tính tiền theo bậc
          </h1>
        </div>
        <div className="bg-slate-100 text-center ">
          <div>
            <h1 className=" text-black text-xl m-2 float-start">
              Các bậc tính tiền
            </h1>
          </div>
          <div>
            <h1 className=" text-black text-xl m-2 float-start">Giá tiền các bậc</h1>
          </div>
          <div>
            <h1 className=" text-black text-xl m-2 float-start">Mức sửa dụng các bậc</h1>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Layout;

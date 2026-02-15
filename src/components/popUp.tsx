import React from "react";
import {Button, Checkbox, ConfigProvider, Form, Input} from "antd";
import {EyeInvisibleOutlined, EyeOutlined} from "@ant-design/icons";
import {useAppDispatch} from "../store/hooks.ts";
import {login} from "../store/authSlice.ts";

function PopUp(): React.ReactElement {

  const [error, setError] = React.useState<string>("")

  const dispatch = useAppDispatch()


  interface FieldType {
    login?: string;
    password?: string;
    rememberMe?: boolean;
  }


  const onFinish = (values: FieldType) => {


    if (values.login && values.password) {


      dispatch(login({
        login: values.login,
        password: values.password,
        rememberMe: !!values.rememberMe
      })).unwrap().then(res => console.log(res)).catch(err => {

        setError(err)
      })
    }
  }

  return (
    <div className="p-[6px] rounded-[40px]  bg-white shadow-[0_24px_32px_0_rgba(0,0,0,0.04)] w-fit font-inter mx-auto">
      <div
        className="bg-linear-to-t p-[1px] from-[rgba(237,237,237,0)] to-[rgba(237,237,237,1)] rounded-[34px] overflow-hidden ">


        <div
          className="p-12 items-center flex flex-col gap-4 bg-white bg-linear-to-t from-white via-[rgba(35,35,35,0)] to-[rgba(35,35,35,0.03)]  rounded-[33px] ">

          <div className="size-[52px]">
            <img src={"public/popUpLogo.svg"} alt="company logo"/>
          </div>
          <div className="flex flex-col gap-3">
            <h2 className={"text-[#232323] font-semibold text-[40px] leading-[1.1] tracking-[-0.015em] "}>Добро
              пожаловать</h2>
            <p className={"leading-[1.5] text-center font-medium text-[18px]  text-[#E0E0E0]"}>Пожалуйста,
              авторизируйтесь</p>
          </div>
          <div className="">
            <ConfigProvider theme={{
              "components": {

                "Checkbox": {
                  "lineWidth": 2
                },
                "Button": {
                  controlHeight: 54,
                }
              }, token: {fontFamily: "Inter", fontSize: 18}
            }}>

              <Form onFinish={onFinish} className={"w-[400px] leading-[1.5]"} layout={"vertical"} requiredMark={false}>
                <Form.Item<FieldType>

                  style={{marginBottom: "16px"}}
                  name={"login"}
                  rules={[{required: true, message: "Введите логин"}]}


                  label={"Логин"}

                >


                  <Input

                    allowClear={{
                      clearIcon: <div className={"w-4 h-4"}><img src={"public/crossIcon.svg"} alt={"cross icon"}/></div>
                    }}

                    style={{padding: "14px 16px"}}
                    prefix={<img src={"public/userInputIcon.svg"} alt="icon of person"/>}/>
                </Form.Item>
                <Form.Item<FieldType>

                  style={{marginBottom: "20px"}}
                  label={"Пароль"}
                  name={"password"}
                  rules={[{required: true, message: "Введите пароль"}]}
                >

                  <Input.Password
                    iconRender={(visible) => (visible ? <EyeOutlined rotate={180}/> :
                      <EyeInvisibleOutlined rotate={180}/>)}
                    style={{padding: "14px 16px",}} prefix={<img src={"public/lockIcon.svg"} alt="icon of person"/>}/>
                </Form.Item>
                <Form.Item<FieldType> name={"rememberMe"} className={"flex"} valuePropName="checked">
                  <Checkbox style={{color: "#9C9C9C", fontSize: "16px"}}>Запомнить данные</Checkbox>
                </Form.Item>

                <div className={"mb-4 text-red-500"}>{error}</div>
                <Form.Item style={{marginBottom: 16}}>
                  <div className="w-[400px]">
                    <Button htmlType={"submit"} type={"primary"} block
                            className={" bg-[#242EDB]! bg-gradient-to-t! from-[rgba(255,255,255,0]! to-[rgba(255,255,255,0.12)]! rounded-[12px]! border-1! border-[#367AFF]! hover:opacity-80 active:opacity-90"}>Войти</Button>
                  </div>
                </Form.Item>

              </Form>
              <div className="relative  flex  flex-row gap-[10px] items-center">
                <div className="h-[1px] border-t-1 border-[#EDEDED] w-full"></div>
                <span
                  className={"bg-linear-to-t text-transparent h-fit from-[rgba(206,206,206,1)] to-[rgba(176,176,176,1)] bg-clip-text"}>

                  или
                  </span>
                <div className="h-[1px] border-t-1 border-[#EDEDED] w-full"></div>
              </div>

              <div className="mt-4 text-[#6C6C6C] leading-[1.5] font-normal">Нет аккаунта? <span
                className={"text-[#242ED8] cursor-pointer"}>Создать</span></div>


            </ConfigProvider>


          </div>
        </div>
      </div>


    </div>
  );
}

export default PopUp;
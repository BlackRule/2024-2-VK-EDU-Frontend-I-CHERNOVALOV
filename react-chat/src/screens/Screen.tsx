import './screen.css'

const Screen:React.FC<React.PropsWithChildren>=(props)=> {

  return (
    <div className="screen">
      {props.children}
    </div>
  )
}

export default Screen

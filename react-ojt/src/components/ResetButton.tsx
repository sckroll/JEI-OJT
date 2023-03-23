import { resetContentState } from "../api";
import Button from "./Button";

export default function ResetButton() {
  const onClick = () => {
    if (confirm('기록을 모두 초기화하시겠어요?')) {
      onReset()
      alert('기록이 모두 초기화되었어요.')
    }
  }
  const onReset = async () => {
    try {
      await resetContentState()
    } catch (e) {
      console.error(e)
      alert('서버에 문제가 발생했습니다. 잠시 후에 다시 시도해주세요.')
    }
  }
  
  return (
    <div className="m-2">
      <Button onClick={onClick}>
        기록 초기화
      </Button>
    </div>
  )
}

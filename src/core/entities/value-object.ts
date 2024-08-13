export abstract class ValueObject<Props> {
  protected props: Props

  protected constructor(props: Props) {
    this.props = props
  }

  public equals(vo: ValueObject<unknown>) {
    if (vo === null || vo === undefined) {
      return false
    }

    if (vo.props === undefined) {
      return false
    }
    if (vo === this) {
      return true
    }

    return JSON.stringify(this.props) === JSON.stringify(vo.props)
  }
}

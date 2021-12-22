<script lang="ts">
  import { Icon, Tooltip } from "."
  import { ButtonContexts, ButtonTypes, IconNames } from "../../lib"
  import { Button } from "../action"
  import { Card } from "../card"
  import { PropEdit } from "../form"
  import { ListGroup, ListGroupAction } from "../list"

  export let create: boolean = false
  export let filter: string
  export let sortColumn: string
  export let sortColumns: { [key: string]: string }
  export let asc: boolean

  let setSortColumn: boolean = false
</script>

<div class="controls">
  <div style="float: left">
    <Button
      type={ButtonTypes.BUTTON}
      context={ButtonContexts.NEUTRAL}
      action={() => (create = !create)}
    >
      <Icon>{IconNames.add}</Icon>
    </Button>
  </div>
  <slot name="info" />
  <div style="float: right; display: flex; flex-direction: row;">
    <PropEdit
      label={filter}
      icon={IconNames.search}
      editHandler={(label) => (filter = label.value)}
    />
    <Tooltip
      visible={setSortColumn}
      onClickOutside={() => (setSortColumn = false)}
    >
      <Button
        type={ButtonTypes.BUTTON}
        context={ButtonContexts.NEUTRAL}
        action={() => (setSortColumn = !setSortColumn)}
      >
        <Icon>{IconNames.filterAlt}</Icon></Button
      >
      <Card --width="200px" slot="content">
        <ListGroup>
          {#each Object.entries(sortColumns) as [columnName, columnId]}
            <ListGroupAction
              buttonContext={ButtonContexts.ANCHOR}
              action={() => {
                setSortColumn = false
                sortColumn = columnId
              }}
              active={sortColumn == columnId}
            >
              {columnName}
            </ListGroupAction>
          {/each}
        </ListGroup>
      </Card>
    </Tooltip>
    <Button
      type={ButtonTypes.BUTTON}
      context={ButtonContexts.NEUTRAL}
      action={() => (asc = !asc)}
    >
      <Icon>{asc ? IconNames.trendingUp : IconNames.trendingDown}</Icon>
    </Button>
  </div>
</div>

{#if create}
  <slot />
{/if}

<style>
  div.controls {
    color: white;
    width: 100%;
    line-height: 30px;
    height: 30px;
    margin: 15px;
    text-align: center;
  }
</style>

````shell

```ts
const reptiles: Array<string> = [
    'Alligator',
    'Crocodile',
    'Chameleon',
    'Komodo Dragon',
    'Iguana',
    'Salamander',
    'Snake',
    'Lizard',
    'Python',
    'Tortoise',
    'Turtle',
]
export const writeReptiles = () => {
    console.log(reptiles.toString())
}
export default writeReptiles()
````

```sh
> REPTILES=$(pnpm --filter=@snailicide/cli-* exec ts-node dist/example-file.js)

$REPTILES > echo
Dragon,Iguana,Salamander,Snake,Lizard,Python,Tortoise,Turtle > Alligator,Crocodile,Chameleon,Komodo

# becomes a script argument.
--filter=@snailicide/cli-* > pnpm run generate:base $REPTILES

# copy output to clipboard
echo $REPTILES | pbcopy
```

```

```

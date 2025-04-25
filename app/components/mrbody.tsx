import { Text, View, ScrollView, useColorScheme, TouchableOpacity,  StyleSheet } from "react-native";

export const ColorTheme = {
    light: {
        text: "#000000",
        background: "#FFFFFF",
    },
    dark: {
        text: "#FFFFFF",
        background: "#000000",
    },
};

export const getThemeColors = (colorScheme: "light" | "dark") => {
    return colorScheme === "dark" ? ColorTheme.dark : ColorTheme.light;
};

export const TextUI = (
    {
      children,
      className,
      style,
      onPress,
      ...props
    }: {
      children: React.ReactNode;
      className?: string;
      style?: object;
      onPress?: () => void;
    } & any
  ) => {
    const colorScheme = useColorScheme();
    const theme = colorScheme === "dark" ? ColorTheme.dark : ColorTheme.light;
  
    return onPress ? (
      <TouchableOpacity onPress={onPress} {...props}>
        <Text style={[style]} className={className}>
          {children}
        </Text>
      </TouchableOpacity>
    ) : (
      <Text style={[{ color: theme.text }, style]} className={className} {...props}>
        {children}
      </Text>
    );
  };
  

export const ViewUI = (
    { children, className }: { children: React.ReactNode; className?: string } | any
) => {
    const colorScheme = useColorScheme();
    const theme = colorScheme === "dark" ? ColorTheme.dark : ColorTheme.light;

    return (
        <View style={{ backgroundColor: theme.background }} className={className}>
            {children}
        </View>
    );
};

export const ScrollViewUI = (
    { children, className, style, ...props }: { children: React.ReactNode; className?:string, style?: object } & any
) => {
    const colorScheme = useColorScheme();
    const theme = colorScheme === "dark" ? ColorTheme.dark : ColorTheme.light;

    return (
        <ScrollView style={[{ backgroundColor: theme.background }, style]} {...props}>
            {children}
        </ScrollView>
    );
};

export const ButtonUI = (
    { onPress, title, children, className, titleClassName, style, ...props }: 
    { onPress?: () => void; title?: string; titleClassName?: string; children?: React.ReactNode; className?: string; style?: object }
) => {
    const colorScheme = useColorScheme();
    const theme = colorScheme === "dark" ? ColorTheme.dark : ColorTheme.light;

    return (
        <TouchableOpacity
            className={className}
            onPress={onPress}
            {...props}
        >
            {title ? (
                <Text className={titleClassName}>
                    {title}
                </Text>
            ) : (
                children
            )}
        </TouchableOpacity>
    );
};
